// AgentInvest MongoDB Initialization Script
// This script creates collections and indexes

// Switch to agentinvest_logs database
db = db.getSiblingDB('agentinvest_logs');

print('Initializing MongoDB collections...');

// ============================================
// System Logs Collection
// ============================================

db.createCollection('logs', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['timestamp', 'level', 'service', 'message'],
      properties: {
        timestamp: {
          bsonType: 'date',
          description: 'Log timestamp'
        },
        level: {
          enum: ['debug', 'info', 'warn', 'error'],
          description: 'Log level'
        },
        service: {
          enum: ['auth', 'market', 'portfolio', 'ai', 'trading', 'gateway'],
          description: 'Service name'
        },
        message: {
          bsonType: 'string',
          description: 'Log message'
        },
        metadata: {
          bsonType: 'object',
          description: 'Additional metadata'
        },
        userId: {
          bsonType: 'string',
          description: 'User ID if applicable'
        },
        requestId: {
          bsonType: 'string',
          description: 'Request ID for tracing'
        },
        stackTrace: {
          bsonType: 'string',
          description: 'Stack trace for errors'
        }
      }
    }
  }
});

// Create indexes for logs
db.logs.createIndex({ timestamp: -1 });
db.logs.createIndex({ service: 1, timestamp: -1 });
db.logs.createIndex({ level: 1, timestamp: -1 });
db.logs.createIndex({ userId: 1, timestamp: -1 });
db.logs.createIndex({ requestId: 1 });

// Set TTL index to auto-delete logs older than 30 days
db.logs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

print('Created logs collection with indexes');

// ============================================
// Analytics Events Collection
// ============================================

db.createCollection('analytics', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['eventType', 'timestamp'],
      properties: {
        eventType: {
          bsonType: 'string',
          description: 'Type of analytics event'
        },
        userId: {
          bsonType: 'string',
          description: 'User ID'
        },
        sessionId: {
          bsonType: 'string',
          description: 'Session ID'
        },
        timestamp: {
          bsonType: 'date',
          description: 'Event timestamp'
        },
        properties: {
          bsonType: 'object',
          description: 'Event properties'
        },
        context: {
          bsonType: 'object',
          description: 'Event context (device, location, etc.)'
        }
      }
    }
  }
});

// Create indexes for analytics
db.analytics.createIndex({ eventType: 1, timestamp: -1 });
db.analytics.createIndex({ userId: 1, timestamp: -1 });
db.analytics.createIndex({ sessionId: 1 });
db.analytics.createIndex({ timestamp: -1 });

// Set TTL index to auto-delete analytics older than 90 days
db.analytics.createIndex({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

print('Created analytics collection with indexes');

// ============================================
// ML Model Results Collection
// ============================================

db.createCollection('ml_results', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['modelName', 'modelVersion', 'symbol', 'timestamp'],
      properties: {
        modelName: {
          bsonType: 'string',
          description: 'ML model name'
        },
        modelVersion: {
          bsonType: 'string',
          description: 'Model version'
        },
        symbol: {
          bsonType: 'string',
          description: 'Stock symbol'
        },
        timestamp: {
          bsonType: 'date',
          description: 'Prediction timestamp'
        },
        prediction: {
          bsonType: 'object',
          description: 'Prediction results'
        },
        features: {
          bsonType: 'object',
          description: 'Input features used'
        },
        accuracy: {
          bsonType: 'double',
          description: 'Model accuracy score'
        },
        metadata: {
          bsonType: 'object',
          description: 'Additional metadata'
        }
      }
    }
  }
});

// Create indexes for ml_results
db.ml_results.createIndex({ symbol: 1, timestamp: -1 });
db.ml_results.createIndex({ modelName: 1, modelVersion: 1 });
db.ml_results.createIndex({ timestamp: -1 });

// Set TTL index to auto-delete results older than 180 days
db.ml_results.createIndex({ timestamp: 1 }, { expireAfterSeconds: 15552000 });

print('Created ml_results collection with indexes');

// ============================================
// News Articles Collection
// ============================================

db.createCollection('news_articles', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'source', 'publishedAt', 'url'],
      properties: {
        title: {
          bsonType: 'string',
          description: 'Article title'
        },
        summary: {
          bsonType: 'string',
          description: 'Article summary'
        },
        content: {
          bsonType: 'string',
          description: 'Full article content'
        },
        source: {
          bsonType: 'string',
          description: 'News source'
        },
        url: {
          bsonType: 'string',
          description: 'Article URL'
        },
        publishedAt: {
          bsonType: 'date',
          description: 'Publication date'
        },
        sentiment: {
          bsonType: 'string',
          enum: ['positive', 'negative', 'neutral'],
          description: 'Sentiment analysis result'
        },
        sentimentScore: {
          bsonType: 'double',
          description: 'Sentiment score (-1 to 1)'
        },
        relatedSymbols: {
          bsonType: 'array',
          items: {
            bsonType: 'string'
          },
          description: 'Related stock symbols'
        },
        tags: {
          bsonType: 'array',
          items: {
            bsonType: 'string'
          },
          description: 'Article tags'
        }
      }
    }
  }
});

// Create indexes for news_articles
db.news_articles.createIndex({ publishedAt: -1 });
db.news_articles.createIndex({ source: 1, publishedAt: -1 });
db.news_articles.createIndex({ relatedSymbols: 1 });
db.news_articles.createIndex({ sentiment: 1 });
db.news_articles.createIndex({ url: 1 }, { unique: true });

// Set TTL index to auto-delete articles older than 60 days
db.news_articles.createIndex({ publishedAt: 1 }, { expireAfterSeconds: 5184000 });

// Text index for search
db.news_articles.createIndex({
  title: 'text',
  summary: 'text',
  content: 'text'
});

print('Created news_articles collection with indexes');

// ============================================
// API Request Logs Collection
// ============================================

db.createCollection('api_requests', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['timestamp', 'method', 'endpoint', 'statusCode'],
      properties: {
        timestamp: {
          bsonType: 'date'
        },
        method: {
          bsonType: 'string',
          enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
        },
        endpoint: {
          bsonType: 'string'
        },
        statusCode: {
          bsonType: 'int'
        },
        responseTime: {
          bsonType: 'int',
          description: 'Response time in milliseconds'
        },
        userId: {
          bsonType: 'string'
        },
        ipAddress: {
          bsonType: 'string'
        },
        userAgent: {
          bsonType: 'string'
        },
        requestId: {
          bsonType: 'string'
        },
        errorMessage: {
          bsonType: 'string'
        }
      }
    }
  }
});

// Create indexes for api_requests
db.api_requests.createIndex({ timestamp: -1 });
db.api_requests.createIndex({ endpoint: 1, timestamp: -1 });
db.api_requests.createIndex({ statusCode: 1, timestamp: -1 });
db.api_requests.createIndex({ userId: 1, timestamp: -1 });
db.api_requests.createIndex({ requestId: 1 });

// Set TTL index to auto-delete requests older than 30 days
db.api_requests.createIndex({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

print('Created api_requests collection with indexes');

// ============================================
// Insert Sample Data
// ============================================

// Sample log entry
db.logs.insertOne({
  timestamp: new Date(),
  level: 'info',
  service: 'auth',
  message: 'MongoDB initialized successfully',
  metadata: {
    collections: ['logs', 'analytics', 'ml_results', 'news_articles', 'api_requests']
  }
});

// Sample analytics event
db.analytics.insertOne({
  eventType: 'app_initialized',
  timestamp: new Date(),
  properties: {
    version: '1.0.0',
    environment: 'development'
  }
});

print('Inserted sample data');

// ============================================
// Create User and Grant Permissions
// ============================================

// Note: This assumes MONGO_INITDB_ROOT_USERNAME and MONGO_INITDB_ROOT_PASSWORD
// are set in the environment variables

print('MongoDB initialization completed successfully!');
print('Collections created: logs, analytics, ml_results, news_articles, api_requests');
print('Indexes created with TTL for automatic data retention');
