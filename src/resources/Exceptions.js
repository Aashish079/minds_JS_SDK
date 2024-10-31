/**
 * Represents an error when an object is not found.
 */
class ObjectNotFound extends Error {
    constructor(message) {
        super(message);
        this.name = 'ObjectNotFound';
    }
}

/**
 * Represents an error when access is forbidden.
 */
class Forbidden extends Error {
    constructor(message) {
        super(message);
        this.name = 'Forbidden';
    }
}

/**
 * Represents an error when authentication fails.
 */
class Unauthorized extends Error {
    constructor(message) {
        super(message);
        this.name = 'Unauthorized';
    }
}

/**
 * Represents an unknown error.
 */
class UnknownError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnknownError';
    }
}

/**
 * Represents an error when an unsupported datasource type is encountered.
 */
class ObjectNotSupported extends Error {
    constructor(message) {
        super(message);
        this.name = 'ObjectNotSupported';
    }
}

module.exports = {
    ObjectNotFound,
    Forbidden,
    Unauthorized,
    UnknownError,
    ObjectNotSupported,
};
