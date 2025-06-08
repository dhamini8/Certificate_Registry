// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateRegistry {
    address public certifier;
    
    struct Certificate {
        string courseName;
        address issuer;
        bool isValid;
    }
    
    mapping(address => Certificate) public certificates;
    
    // Vulnerability 1: No constructor to set initial certifier
    
    // Vulnerability 2: Missing access control
    function setCertifier(address _newCertifier) external {
        certifier = _newCertifier;
    }
    
    // Vulnerability 3: No checks for zero address
    // Vulnerability 4: Missing access control
    function issueCertificate(address student, string calldata courseName) external {
        certificates[student] = Certificate({
            courseName: courseName,
            issuer: msg.sender,
            isValid: true
        });
    }
    
    // Vulnerability 5: Reentrancy vulnerability
    function revokeCertificate(address student) external {
        require(certificates[student].isValid, "Certificate not found");
        // Vulnerability: External call before state change
        (bool success,) = student.call{value: 0}("");
        require(success, "Call failed");
        certificates[student].isValid = false;
    }
}