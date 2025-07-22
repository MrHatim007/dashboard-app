import { Pool } from 'pg';

const pool = new Pool({
  user: 'dashboard_app_db_u4d0_user',
  host: 'dpg-d1vd5pbuibrs7399tmp0-a', // لا تضع .internal هنا
  database: 'postgresql://dashboard_app_db_u4d0_user:JFiaMl9t8ODydjz0WBb9SpagCTNYKgQu@dpg-d1vd5pbuibrs7399tmp0-a/dashboard_app_db_u4d0',
  password: 'JFiaMl9t8ODydjz0WBb9SpagCTNYKgQu',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;