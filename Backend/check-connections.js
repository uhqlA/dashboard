const db = require('./db');

async function checkConnections() {
  try {
    console.log('Checking active connections to branchJ database...\n');
    
    const result = await db.query(`
      SELECT 
        pid,
        usename, /* cspell:disable-line */
        application_name,
        client_addr,
        state,
        backend_start,
        query_start,
        state_change,
        query
      FROM pg_stat_activity 
      WHERE datname = 'branchJ' /* cspell:disable-line */
      ORDER BY backend_start DESC
    `);
    
    console.log(`Found ${result.rows.length} active connections:`);
    console.log('===========================================');
    
    result.rows.forEach((row, index) => {
      console.log(`\nConnection ${index + 1}:`);
      console.log(`  PID: ${row.pid}`);
      console.log(`  User: ${row.usename}`); /* cspell:disable-line */
      console.log(`  Application: ${row.application_name}`);
      console.log(`  Client Address: ${row.client_addr}`);
      console.log(`  State: ${row.state}`);
      console.log(`  Backend Started: ${row.backend_start}`);
      console.log(`  Query Started: ${row.query_start}`);
      console.log(`  Current Query: ${row.query || 'No active query'}`);
    });
    
    if (result.rows.length === 0) {
      console.log('No active connections found. Make sure the server is running.');
    }
    
  } catch (error) {
    console.error('Error checking connections:', error.message);
  } finally {
    await db.end();
  }
}

checkConnections();
