;; Certifi Credentials Contract
;; Manages credential issuance, verification, and revocation
;; Built on Stacks Blockchain

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-UNAUTHORIZED (err u401))
(define-constant ERR-CREDENTIAL-NOT-FOUND (err u404))
(define-constant ERR-CREDENTIAL-EXISTS (err u409))
(define-constant ERR-INVALID-CREDENTIAL (err u420))
(define-constant ERR-INSTITUTION-NOT-VERIFIED (err u421))
(define-constant ERR-ALREADY-REVOKED (err u422))
(define-constant ERR-NOT-REVOKED (err u423))
(define-constant ERR-INVALID-HASH (err u424))
(define-constant ERR-VERIFICATION-FAILED (err u425))
(define-constant ERR-INVALID-STUDENT (err u426))

;; Credential status enum
(define-constant STATUS-ACTIVE u0)
(define-constant STATUS-REVOKED u1)
(define-constant STATUS-EXPIRED u2)

;; Data structures
(define-map credentials
  { credential-id: uint }
  {
    student: principal,
    institution-id: uint,
    credential-type: (string-ascii 128),
    credential-hash: (buff 32),
    issue-date: uint,
    expiry-date: (optional uint),
    status: uint,
    metadata-uri: (string-ascii 512),
    issued-by: principal
  }
)

(define-map credential-by-hash
  { credential-hash: (buff 32) }
  uint
)

(define-map student-credentials
  { student: principal, index: uint }
  uint
)

(define-map student-credential-count
  { student: principal }
  uint
)

(define-map revocation-log
  { credential-id: uint }
  {
    revoked-at: uint,
    revoked-by: principal,
    reason: (string-ascii 256)
  }
)

(define-map verification-log
  { credential-id: uint, verifier: principal }
  {
    verified-at: uint,
    verification-hash: (buff 32)
  }
)

(define-data-var credential-counter uint u0)
(define-data-var total-issued uint u0)
(define-data-var total-revoked uint u0)

;; Issue a new credential
(define-public (issue-credential
  (student principal)
  (institution-id uint)
  (credential-type (string-ascii 128))
  (credential-hash (buff 32))
  (expiry-date (optional uint))
  (metadata-uri (string-ascii 512)))
  (let ((credential-id (var-get credential-counter)))
    ;; Validation
    (asserts! (> (len credential-type) u0) ERR-INVALID-CREDENTIAL)
    (asserts! (> (len credential-hash) u0) ERR-INVALID-HASH)
    (is-none (map-get? credential-by-hash { credential-hash: credential-hash }) ERR-CREDENTIAL-EXISTS)

    ;; Create credential
    (map-insert credentials
      { credential-id: credential-id }
      {
        student: student,
        institution-id: institution-id,
        credential-type: credential-type,
        credential-hash: credential-hash,
        issue-date: burn-block-height,
        expiry-date: expiry-date,
        status: STATUS-ACTIVE,
        metadata-uri: metadata-uri,
        issued-by: tx-sender
      }
    )

    ;; Map hash to credential ID
    (map-set credential-by-hash { credential-hash: credential-hash } credential-id)

    ;; Add to student's credentials
    (let ((student-count (default-to u0 (map-get? student-credential-count { student: student }))))
      (map-set student-credentials { student: student, index: student-count } credential-id)
      (map-set student-credential-count { student: student } (+ student-count u1))
    )

    ;; Update counters
    (var-set credential-counter (+ credential-id u1))
    (var-set total-issued (+ (var-get total-issued) u1))

    (ok credential-id)
  )
)

;; Verify a credential
(define-public (verify-credential (credential-id uint))
  (let ((credential (unwrap! (map-get? credentials { credential-id: credential-id }) ERR-CREDENTIAL-NOT-FOUND)))
    ;; Validation
    (asserts! (is-eq (get status credential) STATUS-ACTIVE) ERR-VERIFICATION-FAILED)

    ;; Log verification
    (map-set verification-log
      { credential-id: credential-id, verifier: tx-sender }
      {
        verified-at: burn-block-height,
        verification-hash: (get credential-hash credential)
      }
    )

    (ok true)
  )
)

;; Revoke a credential
(define-public (revoke-credential (credential-id uint) (reason (string-ascii 256)))
  (let ((credential (unwrap! (map-get? credentials { credential-id: credential-id }) ERR-CREDENTIAL-NOT-FOUND)))
    ;; Validation - only issuer or contract owner can revoke
    (asserts! (or (is-eq tx-sender (get issued-by credential)) (is-eq tx-sender CONTRACT-OWNER)) ERR-UNAUTHORIZED)
    (asserts! (not (is-eq (get status credential) STATUS-REVOKED)) ERR-ALREADY-REVOKED)

    ;; Update credential status
    (map-set credentials
      { credential-id: credential-id }
      (merge credential { status: STATUS-REVOKED })
    )

    ;; Log revocation
    (map-set revocation-log
      { credential-id: credential-id }
      {
        revoked-at: burn-block-height,
        revoked-by: tx-sender,
        reason: reason
      }
    )

    ;; Update counter
    (var-set total-revoked (+ (var-get total-revoked) u1))

    (ok true)
  )
)

;; Get credential details
(define-read-only (get-credential (credential-id uint))
  (map-get? credentials { credential-id: credential-id })
)

;; Get credential by hash
(define-read-only (get-credential-by-hash (credential-hash (buff 32)))
  (match (map-get? credential-by-hash { credential-hash: credential-hash })
    cred-id (map-get? credentials { credential-id: cred-id })
    none
  )
)

;; Get student's credential count
(define-read-only (get-student-credential-count (student principal))
  (default-to u0 (map-get? student-credential-count { student: student }))
)

;; Get student's credential by index
(define-read-only (get-student-credential (student principal) (index uint))
  (match (map-get? student-credentials { student: student, index: index })
    cred-id (map-get? credentials { credential-id: cred-id })
    none
  )
)

;; Check if credential is valid
(define-read-only (is-credential-valid (credential-id uint))
  (match (map-get? credentials { credential-id: credential-id })
    credential (is-eq (get status credential) STATUS-ACTIVE)
    false
  )
)

;; Get revocation details
(define-read-only (get-revocation-info (credential-id uint))
  (map-get? revocation-log { credential-id: credential-id })
)

;; Get verification details
(define-read-only (get-verification-info (credential-id uint) (verifier principal))
  (map-get? verification-log { credential-id: credential-id, verifier: verifier })
)

;; Get total credentials issued
(define-read-only (get-total-issued)
  (var-get total-issued)
)

;; Get total credentials revoked
(define-read-only (get-total-revoked)
  (var-get total-revoked)
)

;; Get total active credentials
(define-read-only (get-total-active)
  (- (var-get total-issued) (var-get total-revoked))
)

;; Verify credential authenticity by hash
(define-read-only (verify-credential-hash (credential-hash (buff 32)))
  (match (map-get? credential-by-hash { credential-hash: credential-hash })
    cred-id (match (map-get? credentials { credential-id: cred-id })
      credential {
        found: true,
        credential-id: cred-id,
        valid: (is-eq (get status credential) STATUS-ACTIVE),
        student: (get student credential),
        credential-type: (get credential-type credential),
        issue-date: (get issue-date credential)
      }
      {
        found: false,
        credential-id: u0,
        valid: false,
        student: tx-sender,
        credential-type: "",
        issue-date: u0
      }
    )
    {
      found: false,
      credential-id: u0,
      valid: false,
      student: tx-sender,
      credential-type: "",
      issue-date: u0
    }
  )
)

;; Get credential status
(define-read-only (get-credential-status (credential-id uint))
  (match (map-get? credentials { credential-id: credential-id })
    credential (get status credential)
    u255
  )
)
