const time = '2 hours 42 mins';

const parser = time => {
  return time.split(' ');
};

console.log(parser(time));
