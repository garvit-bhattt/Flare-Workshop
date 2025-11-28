// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Certificate {
    address public owner;

    struct CertData {
        string studentName;
        string courseName;
        string grade;
        uint256 timestamp;
    }

    mapping(uint256 => CertData) public certificates;
    uint256 public certCount;

    event CertificateIssued(
        uint256 certId,
        string studentName,
        string courseName,
        string grade,
        uint256 timestamp
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can issue certificates");
        _;
    }

    function issueCertificate(
        string memory _studentName,
        string memory _courseName,
        string memory _grade
    ) public onlyOwner returns (uint256) {
        certCount++;

        certificates[certCount] = CertData({
            studentName: _studentName,
            courseName: _courseName,
            grade: _grade,
            timestamp: block.timestamp
        });

        emit CertificateIssued(
            certCount,
            _studentName,
            _courseName,
            _grade,
            block.timestamp
        );

        return certCount;
    }

    function getCertificate(uint256 _certId)
        public
        view
        returns (
            string memory studentName,
            string memory courseName,
            string memory grade,
            uint256 timestamp
        )
    {
        CertData memory cert = certificates[_certId];
        return (cert.studentName, cert.courseName, cert.grade, cert.timestamp);
    }
}
