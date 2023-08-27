import crypto from 'crypto';

const hash_to_md5 = (string: string) => {
  return crypto.createHash('md5').update(string).digest('hex');
};

export default hash_to_md5;
