import { Request, Response } from 'express';
import Device from '../models/device.model';
import Threat, { ThreatSeverity, ThreatType } from '../models/threat.model';
import ScanReport from '../models/scan.model';

import { AuthenticatedRequest } from '../types/express';

export const runScan = async (req: AuthenticatedRequest, res: Response) => {
  const { deviceId, pathsToScan } = req.body;

  if (!deviceId) {
    return res.status(400).json({ message: 'Device ID is required' });
  }

  try {
    const device = await Device.findOne({ _id: deviceId });
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    const scanLog: { timestamp: Date; message: string; level: 'info' | 'warning' | 'error' }[] = [];
    const scannedPaths: string[] = [];
    const threats: any[] = [];
    let newThreatsCount = 0;

    const startTime = Date.now();

    scanLog.push({ timestamp: new Date(), message: `Starting scan for device: ${device.deviceName} (${device.ipAddress})...`, level: 'info' });

    if (pathsToScan && pathsToScan.length > 0) {
      for (const path of pathsToScan) {
        scannedPaths.push(path);
        scanLog.push({ timestamp: new Date(), message: `Checking ${path}...`, level: 'info' });
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate scanning time

        // Simulate threat detection based on path or file patterns
        if (path.includes('malware') || path.includes('virus') || Math.random() < 0.2) { // 20% chance to find a threat
          const newThreat = new Threat({
            name: `Simulated Threat in ${path}`,
            description: `A simulated threat detected during scan in path: ${path}.`,
            type: ThreatType.MALWARE,
            severity: ThreatSeverity.HIGH,
            signatureHash: `hash-${Date.now()}-${path}`,
            affectedSystems: [device.deviceName],
            remediationSteps: ['Quarantine file', 'Run full system scan'],
          });
          await newThreat.save();
          threats.push(newThreat);
          newThreatsCount++;
          scanLog.push({ timestamp: new Date(), message: `THREAT DETECTED: ${newThreat.name} (Severity: ${newThreat.severity})`, level: 'warning' });
        }
      }
    } else {
      scanLog.push({ timestamp: new Date(), message: 'No specific paths to scan provided. Performing a quick system check...', level: 'info' });
      scannedPaths.push('System Check');
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (Math.random() < 0.1) { // 10% chance to find a threat during quick check
        const newThreat = new Threat({
          name: 'Simulated System Threat',
          description: 'A simulated system threat detected during quick check.',
          type: ThreatType.ROOTKIT,
          severity: ThreatSeverity.MEDIUM,
          signatureHash: `hash-${Date.now()}-system`,
          affectedSystems: [device.deviceName],
          remediationSteps: ['Review system logs', 'Perform full scan'],
        });
        await newThreat.save();
        threats.push(newThreat);
        newThreatsCount++;
        scanLog.push({ timestamp: new Date(), message: `THREAT DETECTED: ${newThreat.name} (Severity: ${newThreat.severity})`, level: 'warning' });
      }
    }

    scanLog.push({ timestamp: new Date(), message: 'Analyzing system files...', level: 'info' });
    await new Promise(resolve => setTimeout(resolve, 1500));

    const endTime = Date.now();
    const duration = endTime - startTime;

    scanLog.push({ timestamp: new Date(), message: `Scan completed for device: ${device.deviceName}. Threats found: ${newThreatsCount}. Duration: ${duration}ms.`, level: 'info' });

    const scanReport = new ScanReport({
      deviceId: device._id,
      deviceName: device.deviceName,
      scanDate: new Date(),
      status: 'completed',
      threatsFound: newThreatsCount,
      threats: threats.map(threat => threat._id),
      scanLog,
      duration,
      scannedPaths,
    });
    await scanReport.save();

    // Update device's last scan time and threat count
    device.lastScan = new Date();
    device.threatCount = (device.threatCount || 0) + newThreatsCount;
    await device.save();

    res.json({ message: 'Scan initiated successfully', newThreatsCount, scanLog, scanReportId: scanReport._id });
  } catch (error: any) {
    console.error('Error running scan:', error);
    res.status(500).json({ message: 'Error initiating scan', error: error.message });
  }
};

export const getScanReports = async (req: Request, res: Response) => {
  try {
    const { device } = req.query;
    let query: any = {};

    if (device) {
      query.deviceName = device;
    }

    const scanReports = await ScanReport.find(query).populate('threats').sort({ scanDate: -1 });
    res.json(scanReports);
  } catch (error: any) {
    console.error('Error fetching scan reports:', error);
    res.status(500).json({ message: 'Error fetching scan reports', error: error.message });
  }
};