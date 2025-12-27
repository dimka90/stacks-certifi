;; Certifi NFT Contract
;; Implements SIP-009 standard

(impl-trait .sip009-nft-trait.sip009-nft-trait)

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-TOKEN-OWNER (err u100))
(define-constant ERR-NOT-CONTRACT-OWNER (err u101))

;; Data Vars
(define-data-var last-token-id uint u0)

;; Non-Fungible Token
(define-non-fungible-token certifi-token uint)

;; Maps
(define-map token-uris uint (string-ascii 256))

;; SIP-009: Get the last token ID
(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

;; SIP-009: Get the token URI
(define-read-only (get-token-uri (token-id uint))
  (ok (map-get? token-uris token-id))
)

;; SIP-009: Get the owner of the token
(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? certifi-token token-id))
)

;; SIP-009: Transfer the token
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-TOKEN-OWNER)
    (nft-transfer? certifi-token token-id sender recipient)
  )
)

;; Mint new token (only contract owner)
(define-public (mint (recipient principal) (uri (string-ascii 256)))
  (let
    (
      (token-id (+ (var-get last-token-id) u1))
    )
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-CONTRACT-OWNER)
    (try! (nft-mint? certifi-token token-id recipient))
    (map-set token-uris token-id uri)
    (var-set last-token-id token-id)
    (ok token-id)
  )
)

;; Burn token
(define-public (burn (token-id uint))
  (let
    (
      (owner (unwrap! (nft-get-owner? certifi-token token-id) ERR-NOT-TOKEN-OWNER))
    )
    (asserts! (is-eq tx-sender owner) ERR-NOT-TOKEN-OWNER)
    (nft-burn? certifi-token token-id owner)
  )
)
