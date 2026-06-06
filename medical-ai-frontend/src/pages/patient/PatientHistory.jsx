import React, { useEffect, useState } from "react";
import { FileText, Eye, ArrowRight, Activity, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchPatientHistory } from "../../services/api";

const PatientHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchPatientHistory();
        setSessions(data);
      } catch (error) {
        console.error("Failed to load history", error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500">Loading records...</div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analysis History</h2>
          <p className="text-gray-500 mt-1">
            Archive of all your diagnostic sessions.
          </p>
        </div>
        <Link
          to="/patient/diagnosis"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700"
        >
          + New Analysis
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {sessions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              No Records Found
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't run any AI diagnostics yet.
            </p>
            <Link
              to="/patient/diagnosis"
              className="text-blue-600 font-bold hover:underline"
            >
              Start your first session
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                    Disease Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                    AI Result
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                    Confidence
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">
                    Doctor Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">
                    Report
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sessions.map((session) => (
                  <tr
                    key={session.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {new Date(session.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          session.disease_type === "AE"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {session.disease_type === "AE"
                          ? "Encephalitis"
                          : "Pemphigus"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {session.prediction_result || "Pending"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full mr-2">
                          <div
                            className="h-1.5 bg-green-500 rounded-full"
                            style={{ width: `${session.confidence_score}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold">
                          {session.confidence_score}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold border ${
                          session.status === "verified"
                            ? "bg-green-50 border-green-200 text-green-700"
                            : session.status === "rejected"
                              ? "bg-red-50 border-red-200 text-red-700"
                              : "bg-gray-50 border-gray-200 text-gray-600"
                        }`}
                      >
                        {session.status === "completed"
                          ? "Needs Review"
                          : session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {/* We can reuse PatientResults by passing state, or build a dedicated detail view. 
                                Reusing Results is easiest for FYP. */}
                      <Link
                        to="/patient/results"
                        state={{ result: session }} // Pass the full session object
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-bold text-sm"
                      >
                        View <ArrowRight className="ml-1 w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHistory;
