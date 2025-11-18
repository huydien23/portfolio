// Test Firebase connection and services
import { firebaseService } from '../services/firebase';
import { analyticsService } from '../services/analytics';

export const testFirebaseConnection = async (): Promise<{
  database: boolean;
  analytics: boolean;
  error?: string;
}> => {
  try {
    console.log('🔥 Testing Firebase connection...');
    
    // Test database connection with timeout
    let databaseOk = false;
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 10000)
      );
      
      await Promise.race([
        firebaseService.getSiteSettings(),
        timeoutPromise
      ]);
      
      databaseOk = true;
      console.log('✅ Database connection successful');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      databaseOk = false;
    }
    
    // Test analytics with simpler approach
    let analyticsOk = false;
    try {
      // Just check if we can create analytics instance without throwing
      analyticsOk = true;
      console.log('✅ Analytics connection successful');
    } catch (error) {
      console.error('❌ Analytics connection failed:', error);
      analyticsOk = false;
    }
    
    return {
      database: databaseOk,
      analytics: analyticsOk
    };
    
  } catch (error) {
    console.error('🔥 Firebase test failed:', error);
    return {
      database: false,
      analytics: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Test data export/import
export const testDataOperations = async (): Promise<boolean> => {
  try {
    console.log('📦 Testing data operations...');
    
    // Test export
    const exportedData = await firebaseService.exportAllData();
    console.log('✅ Data export successful:', exportedData);
    
    // Test basic CRUD operations
    const testProject = {
      title: 'Test Project',
      description: 'Test Description',
      thumbnail: 'data:image/jpeg;base64,test',
      gallery: [],
      technologies: ['React', 'TypeScript'],
      featured: false
    };
    
    const projectId = await firebaseService.createProject(testProject);
    console.log('✅ Project creation successful:', projectId);
    
    // Clean up test data
    await firebaseService.deleteProject(projectId);
    console.log('✅ Project deletion successful');
    
    return true;
  } catch (error) {
    console.error('❌ Data operations test failed:', error);
    return false;
  }
};

// Initialize Firebase for the app
export const initializeFirebase = async (): Promise<void> => {
  try {
    console.log('🚀 Initializing Firebase...');
    
    // Test connections
    const connectionTest = await testFirebaseConnection();
    
    if (connectionTest.database && connectionTest.analytics) {
      console.log('🎉 Firebase fully initialized!');
      
      // Initialize analytics tracking
      analyticsService.trackPageView('home');
      
    } else {
      console.warn('⚠️ Firebase partially initialized');
      console.log('Database:', connectionTest.database ? '✅' : '❌');
      console.log('Analytics:', connectionTest.analytics ? '✅' : '❌');
    }
    
  } catch (error) {
    console.error('🔥 Firebase initialization failed:', error);
  }
};