import React from "react";

const AppSimple = () => {
  return (
    <div className="flex min-h-screen bg-red-100">
      <div className="flex items-center justify-center w-full">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">SEMENKITA</h1>
          <p className="text-slate-600">
            Testing basic render - Simple Version
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppSimple;
