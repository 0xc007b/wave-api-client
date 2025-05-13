# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-05-10

### Removed
- Webhooks API has been completely removed as it was deprecated

## [0.3.0] - 2025-04-15

### Added
- Full support for Checkout API
- Enhanced error handling with detailed error types
- Additional optional parameters for all API calls
- Comprehensive TypeScript documentation

### Changed
- Improved response type definitions
- Updated axios dependency to version 1.3.5
- Refactored client configuration

### Deprecated
- Webhooks API has been marked as deprecated

## [0.2.0] - 2025-03-10

### Added
- Support for Balance & Reconciliation API
- Support for Payout API
- Initial type definitions for all Wave API responses
- Better error handling

### Fixed
- Authentication issues with API keys
- Timeout handling for long-running requests

## [0.1.0] - 2025-02-25

### Added
- Initial release with basic client structure
- Support for authentication
- Merchants API implementation
- Basic Webhooks API support
- Initial documentation
- Test coverage setup

[0.3.0]: https://github.com/0xc007b/wave-api-client/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/0xc007b/wave-api-client/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/0xc007b/wave-api-client/releases/tag/v0.1.0
