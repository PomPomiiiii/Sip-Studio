const sql = require('mssql')

const config = {
  user: 'sa',
  password: 'sip_studio_13',
  server: '127.0.0.1',
  port: 51181,
  database: 'SipStudio',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: ''
  }
}

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => { console.log('✅ Connected to SQL Server'); return pool })
  .catch(err => console.error('❌ DB connection failed:', err))

module.exports = { sql, poolPromise }