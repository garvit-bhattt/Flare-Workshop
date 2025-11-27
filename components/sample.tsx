"use client";

import { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { useCertificateContract } from "@/hooks/useContract";
import { contractABI, contractAddress } from "@/lib/contract";

const SampleIntegration = () => {
  const { isConnected } = useAccount();
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [certificateId, setCertificateId] = useState("");

  const { certificateCount, actions, state } = useCertificateContract();

  const { data: certData } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "getCertificate",
    args: certificateId ? [BigInt(certificateId)] : undefined,
    query: { enabled: !!certificateId },
  });

  const handleIssue = async () => {
    if (!studentName || !courseName) return;
    await actions.issueCertificate(studentName, courseName);
    setStudentName("");
    setCourseName("");
  };

  if (!isConnected) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-lg font-bold">Certificate DApp</h2>
        <p>Please connect your wallet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-8">

      <h1 className="text-3xl font-bold">Certificate DApp</h1>

      <div className="p-4 border rounded-lg">
        <p className="font-semibold">Total Certificates Issued:</p>
        <p>{certificateCount}</p>
      </div>

      {/* Issue Certificate */}
      <div className="space-y-3 p-4 border rounded-lg">
        <h2 className="text-xl font-bold">Issue Certificate</h2>

        <input
          className="w-full p-2 border rounded"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />

        <input
          className="w-full p-2 border rounded"
          placeholder="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white p-2 rounded-lg"
          onClick={handleIssue}
          disabled={state.isLoading}
        >
          {state.isLoading ? "Issuing..." : "Issue Certificate"}
        </button>
      </div>

      {/* View Certificate */}
      <div className="space-y-3 p-4 border rounded-lg">
        <h2 className="text-xl font-bold">View Certificate</h2>

        <input
          className="w-full p-2 border rounded"
          placeholder="Certificate ID"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
        />

        {certData && (
          <div className="mt-4 p-3 border rounded-lg">
            <p><strong>Name:</strong> {String(certData[0])}</p>
            <p><strong>Course:</strong> {String(certData[1])}</p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(Number(certData[2]) * 1000).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Transaction Status */}
      {state.hash && (
        <div className="p-4 border rounded-lg break-all">
          <p className="text-sm font-semibold">Tx Hash:</p>
          <p>{state.hash}</p>
        </div>
      )}

      {state.error && (
        <div className="p-4 border border-red-500 rounded-lg text-red-600">
          Error: {state.error.message}
        </div>
      )}
    </div>
  );
};

export default SampleIntegration;
