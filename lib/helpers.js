/**
 * @desc Return an array of all the values
 * @param {Array} array
 * @return {Array} array
 */
exports.filter = array => array.filter(x => x);

/**
 * @desc calc header length
 * @param {Object} answers
 * @return {Int} length
 */
const headerLength = answers => answers.type.length + 2 + (answers.scope ? answers.scope.length + 2 : 0);


/**
 * @desc calc max maxSummaryLength
 * @param {Object} options
 * @param {Object} answers
 * @return {Int} length
 */
exports.maxSummaryLength = (options, answers) => options.maxHeaderWidth - headerLength(answers);

/**
 * @desc filterSubject
 * @param {String} subject
 * @return {String} subject
 */
exports.filterSubject = (subject) => {
  subject = subject.trim();
  if (subject.charAt(0).toLowerCase() !== subject.charAt(0)) {
    subject = subject.charAt(0).toLowerCase() + subject.slice(1, subject.length);
  }
  while (subject.endsWith('.')) {
    subject = subject.slice(0, subject.length - 1);
  }
  return subject;
};
