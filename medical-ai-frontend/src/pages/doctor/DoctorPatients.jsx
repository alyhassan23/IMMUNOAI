import React, { useEffect, useState } from "react";
import { Search, Filter, ArrowRight, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchPatientRegistry } from "../../services/api"; // Import API

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await fetchPatientRegistry();
      setPatients(data);
    } catch (error) {
      alert("Failed to load patient data. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 flex justify-center">
        <Loader className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Patient Registry (Real-Time)
        </h2>
        {/* ... Search bar remains the same ... */}
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Patient / Session
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Disease Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  AI Confidence
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No diagnostic sessions found.
                  </td>
                </tr>
              ) : (
                patients.map((session) => (
                  <tr
                    key={session.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                          P{session.patient}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">
                            Patient #{session.patient}
                          </div>
                          <div className="text-xs text-gray-500">
                            Session ID: {session.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-700 font-bold">
                        {session.disease_type} Pipeline
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-bold text-gray-900">
                          {session.confidence_score}%
                        </span>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full ml-2">
                          <div
                            className="h-1.5 bg-green-500 rounded-full"
                            style={{ width: `${session.confidence_score}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          session.status === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : session.status === "verified"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100"
                        }`}
                      >
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(session.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {/* Link to Detail Page */}
                      <Link
                        to={`/doctor/patients/${session.id}`}
                        className="text-blue-600 hover:text-blue-900 flex items-center justify-end font-bold"
                      >
                        Review <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorPatients;
