interface MigrationRequest {
  migratePost: (startPage: number, endPage: number, batch: number, restApi: string) => Promise<any>;
  migrateAuthor: () => Promise<any>;
  migrateUser: (startPage: number, endPage: number, batch: number) => Promise<any>;
  migrateCategory: (startPage: number, endPage: number, batch: number, restApi: string) => Promise<any>;
  migrateTag: (startPage: number, endPage: number, batch: number, restApi: string) => Promise<any>;
  migrateMedia: (startPage: number, endPage: number, batch: number, restApi: string) => Promise<any>;
  migrateComment: (startPage: number, endPage: number, batch: number, restApi: string) => Promise<any>;
}

const migrationRequest: MigrationRequest = {
  migratePost: async (startPage, endPage, batch, restApi) => {
    const response = await fetch(`/w-to-s-migrator-plugin/migrate-post/${startPage}/${endPage}/${batch}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ restApi }),
    });
    return response.json();
  },
  migrateAuthor: async () => {
    const response = await fetch('/w-to-s-migrator-plugin/migrate-author', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  },
  migrateUser: async (startPage, endPage, batch) => {
    const response = await fetch(`/w-to-s-migrator-plugin/migrate-users/${startPage}/${endPage}/${batch}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },
  migrateCategory: async (startPage, endPage, batch, restApi) => {
    const response = await fetch(`/w-to-s-migrator-plugin/migrate-category/${startPage}/${endPage}/${batch}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ restApi }),
    });
    return response.json();
  },
  migrateTag: async (startPage, endPage, batch, restApi) => {
    const response = await fetch(`/w-to-s-migrator-plugin/migrate-tag/${startPage}/${endPage}/${batch}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ restApi }),
    });
    return response.json();
  },
  migrateMedia: async (startPage, endPage, batch, restApi) => {
    const response = await fetch(`/w-to-s-migrator-plugin/migrate-media/${startPage}/${endPage}/${batch}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ restApi }),
    });
    console.log({response:response.json},"this is inside client")
    return response.json();
  },
  migrateComment: async (startPage, endPage, batch, restApi) => {
    const response = await fetch(`/w-to-s-migrator-plugin/migrate-comment/${startPage}/${endPage}/${batch}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ restApi }),
    });
    return response.json();
  },
};

export default migrationRequest;