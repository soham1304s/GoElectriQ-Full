import fs from 'fs';
import path from 'path';

const isVercel = process.env.VERCEL || process.env.NOW_BUILDER;
const logsDir = path.join(process.cwd(), 'logs');

// Create logs directory if it doesn't exist (only if not on Vercel)
if (!isVercel && !fs.existsSync(logsDir)) {
  try {
    fs.mkdirSync(logsDir, { recursive: true });
  } catch (error) {
    console.warn('Warning: Could not create logs directory:', error.message);
  }
}

/**
 * Log levels
 */
const LogLevel = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
};

/**
 * Format log message
 */
const formatLogMessage = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaString = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
  return `[${timestamp}] [${level}] ${message} ${metaString}\n`;
};

/**
 * Write log to file
 */
const writeLog = (filename, message) => {
  if (isVercel) return; // Skip file logging on Vercel
  const filepath = path.join(logsDir, filename);
  try {
    fs.appendFileSync(filepath, message);
  } catch (error) {
    // Fail silently to avoid crashing the request
  }
};

/**
 * Logger class
 */
class Logger {
  /**
   * Log info message
   */
  static info(message, meta = {}) {
    const logMessage = formatLogMessage(LogLevel.INFO, message, meta);
    console.log(logMessage.trim());
    
    if (process.env.NODE_ENV === 'production') {
      writeLog('info.log', logMessage);
      writeLog('combined.log', logMessage);
    }
  }

  /**
   * Log warning message
   */
  static warn(message, meta = {}) {
    const logMessage = formatLogMessage(LogLevel.WARN, message, meta);
    console.warn(logMessage.trim());
    
    if (process.env.NODE_ENV === 'production') {
      writeLog('warn.log', logMessage);
      writeLog('combined.log', logMessage);
    }
  }

  /**
   * Log error message
   */
  static error(message, meta = {}) {
    const logMessage = formatLogMessage(LogLevel.ERROR, message, meta);
    console.error(logMessage.trim());
    
    writeLog('error.log', logMessage);
    writeLog('combined.log', logMessage);
  }

  /**
   * Log debug message (only in development)
   */
  static debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const logMessage = formatLogMessage(LogLevel.DEBUG, message, meta);
      console.log(logMessage.trim());
      writeLog('debug.log', logMessage);
    }
  }

  /**
   * Log API request
   */
  static request(req) {
    const message = `${req.method} ${req.originalUrl}`;
    const meta = {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user?._id,
    };
    
    this.info(message, meta);
  }

  /**
   * Log API response
   */
  static response(req, res, duration) {
    const message = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`;
    this.info(message);
  }
}

export default Logger;