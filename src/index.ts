import Tools from './Tools'


exports.Tools = Tools;
export default (params, AwsConfig) => new Tools(params, AwsConfig)
module.exports = (params, AwsConfig) => new Tools(params, AwsConfig)
