;; Certifi Events Module
;; Defines all event types for credential operations

;; Event: Credential Issued
;; Emitted when a new credential is issued
(define-event credential-issued
  (
    (credential-id uint)
    (student principal)
    (institution-id uint)
    (credential-type (string-ascii 128))
    (timestamp uint)
  )
)

;; Event: Credential Verified
;; Emitted when a credential is verified
(define-event credential-verified
  (
    (credential-id uint)
    (verifier principal)
    (timestamp uint)
  )
)

;; Event: Credential Revoked
;; Emitted when a credential is revoked
(define-event credential-revoked
  (
    (credential-id uint)
    (reason (string-ascii 256))
    (timestamp uint)
  )
)

;; Event: Institution Registered
;; Emitted when an institution is registered
(define-event institution-registered
  (
    (institution-id uint)
    (name (string-ascii 256))
    (country (string-ascii 128))
    (timestamp uint)
  )
)

;; Event: Institution Verified
;; Emitted when an institution is verified
(define-event institution-verified
  (
    (institution-id uint)
    (verifier principal)
    (timestamp uint)
  )
)
