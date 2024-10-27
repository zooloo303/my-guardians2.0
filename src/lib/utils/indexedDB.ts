import { manifestTables } from './helpers';

const DB_NAME = 'DestinyManifest';
const DB_VERSION = 1;

interface ManifestTable {
	[key: string]: object;
}

interface ManifestData {
	version: string;
	tables: Record<string, ManifestTable>;
}

export async function openDatabase(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains('version')) {
				db.createObjectStore('version', { keyPath: 'id' });
			}
			manifestTables.forEach((table) => {
				if (!db.objectStoreNames.contains(table)) {
					db.createObjectStore(table, { keyPath: 'hash' });
				}
			});
		};
	});
}

export async function storeManifestData(data: ManifestData): Promise<void> {
	const db = await openDatabase();
	const transaction = db.transaction(['version', ...Object.keys(data.tables)], 'readwrite');

	// Store or update version
	const versionStore = transaction.objectStore('version');
	await versionStore.put({ id: 'current', version: data.version });

	// Store table data
	for (const [table, tableData] of Object.entries(data.tables)) {
		const objectStore = transaction.objectStore(table);
		for (const [hash, item] of Object.entries(tableData)) {
			await objectStore.put({ hash: Number(hash), ...item });
		}
	}

	return new Promise((resolve, reject) => {
		transaction.oncomplete = () => resolve();
		transaction.onerror = () => reject(transaction.error);
	});
}

export async function getManifestVersion(): Promise<string | null> {
	const db = await openDatabase();
	const transaction = db.transaction('version', 'readonly');
	const objectStore = transaction.objectStore('version');

	return new Promise((resolve, reject) => {
		const request = objectStore.get('current');
		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result?.version || null);
	});
}

export async function getManifestData<T>(table: string, hash: number): Promise<T | undefined> {
	const db = await openDatabase();
	const transaction = db.transaction(table, 'readonly');
	const objectStore = transaction.objectStore(table);

	return new Promise((resolve, reject) => {
		const request = objectStore.get(hash);
		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result as T | undefined);
	});
}

export async function getManifestTable<T>(table: string): Promise<Record<number, T>> {
	const db = await openDatabase();
	const transaction = db.transaction(table, 'readonly');
	const objectStore = transaction.objectStore(table);
  
	return new Promise((resolve, reject) => {
	  const request = objectStore.getAll();
	  request.onerror = () => reject(request.error);
	  request.onsuccess = () => {
		const result: Record<number, T> = {};
		request.result.forEach((item: T & { hash: number }) => {
		  result[item.hash] = item;
		});
		resolve(result);
	  };
	});
  }
