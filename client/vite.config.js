import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
// https://vite.dev/config/
export default defineConfig(function (_a) {
  var mode = _a.mode;
  var env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: {
        port: 3010,
        clientPort: parseInt(env.VITE_HMR_PORT || '3010'),
      },
    },
  };
});
