import { writable, type Writable } from 'svelte/store';

interface MaintenanceStatus {
  enabled: boolean;
  message: string;
  timestamp: string;
}

export const maintenanceStatus: Writable<MaintenanceStatus> = writable({
  enabled: false,
  message: '',
  timestamp: ''
});

export async function checkApiStatus() {
  try {
    console.log('Checking API status...');
    const settingsResponse = await fetch('https://www.bungie.net/Platform/Settings/');
    const settingsData = await settingsResponse.json();
    
    const isDestiny2Disabled = !settingsData.Response?.Systems?.Destiny2?.enabled;
    console.log('API Status:', {
      isDestiny2Disabled,
      destiny2System: settingsData.Response?.Systems?.Destiny2
    });
    
    if (isDestiny2Disabled) {
      console.log('API is disabled, fetching alerts...');
      const alertsResponse = await fetch('https://www.bungie.net/Platform/GlobalAlerts/');
      const alertsData = await alertsResponse.json();
      
      const maintenanceAlert = alertsData.Response?.[0] || {};
      console.log('Maintenance alert:', maintenanceAlert);
      
      maintenanceStatus.set({
        enabled: true,
        message: maintenanceAlert.AlertHtml || 'Destiny 2 API is currently undergoing maintenance.',
        timestamp: maintenanceAlert.AlertTimestamp
      });
    } else {
      console.log('API is enabled, resetting maintenance status');
      maintenanceStatus.set({ enabled: false, message: '', timestamp: '' });
    }
  } catch (error) {
    console.error('Error checking API status:', error);
    maintenanceStatus.set({
      enabled: true,
      message: 'Unable to connect to Destiny 2 API. Service may be unavailable.',
      timestamp: ''
    });
  }
} 