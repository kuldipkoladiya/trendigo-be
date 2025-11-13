import ngrok from 'ngrok';
import config from 'config/config';
import { logger } from 'config/logger';

const startNgrok = async () => {
  // Only run in development by default and when explicitly enabled.
  if (process.env.NODE_ENV !== 'development') {
    logger.info('Ngrok: skipped because NODE_ENV is not development');
    return null;
  }

  // console.log('ENV DEBUG:', {
  //   NODE_ENV: process.env.NODE_ENV,
  //   NGROK_ENABLED: process.env.NGROK_ENABLED,
  // });
  const enabled = (process.env.NGROK_ENABLED || '').trim() === 'true';
  // console.log('=====xx====>', enabled);
  if (!enabled) {
    logger.info('Ngrok: NGROK_ENABLED is not set to "true" — tunnel will not start automatically.');
    return null;
  }

  const options = { addr: config.port };
  if (process.env.NGROK_AUTHTOKEN) options.authtoken = process.env.NGROK_AUTHTOKEN;
  if (process.env.NGROK_REGION) options.region = process.env.NGROK_REGION;
  if (process.env.NGROK_SUBDOMAIN) options.subdomain = process.env.NGROK_SUBDOMAIN;

  try {
    const url = await ngrok.connect(options);
    logger.info(`Ngrok tunnel started: ${url}`);
    // Also print to stdout so dev sees it in console
    // eslint-disable-next-line no-console
    console.log(`\n>>> Ngrok tunnel: ${url} (port ${config.port})\n`);
    // Optionally expose this URL to the rest of the app via env
    process.env.PUBLIC_URL = url;
    return url;
  } catch (err) {
    logger.error(`Failed to start ngrok tunnel: ${err && err.message ? err.message : err}`);
    return null;
  }
};

export default startNgrok;
