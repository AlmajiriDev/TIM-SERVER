const Enum = require("enum");
const status = new Enum({ PENDING: 0, ACTIVE: 1, INACTIVE: 2, ONLINE: 3, DELETED: 4 }, { freeze: true, ignoreCase: true });
const accountType = new Enum({individual: 0, chapter: 1 }, { freeze: true, ignoreCase: true });
const occupation = new Enum({student: 0, graduate: 1, employed: 2, unemployed: 3,})
// const graduation_status = new Enum({undergraduate: 0, graduate: 1, postgraduate: 2})
const profileStatus = new Enum({ none: 0, half: 1, semiComplete: 2, completed: 3 }, { freeze: true, ignoreCase: true });
module.exports = { status, accountType, occupation, profileStatus};
