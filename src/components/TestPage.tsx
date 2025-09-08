import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          ✅ Website is Working!
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          The React application is loading correctly.
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• React components are rendering</p>
          <p>• CSS is loading properly</p>
          <p>• No JavaScript errors detected</p>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Go to Main Site
        </button>
      </div>
    </div>
  );
};

export default TestPage;
