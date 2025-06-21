
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import SalesModule from '@/components/SalesModule';
import CashierManagement from '@/components/CashierManagement';
import Reports from '@/components/Reports';
import SafeSettings from '@/components/SafeSettings';

const Index = () => {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Navigation />
        <main className="flex-1 ml-64 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sales" element={<SalesModule />} />
            <Route path="/cashiers" element={<CashierManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<SafeSettings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default Index;
