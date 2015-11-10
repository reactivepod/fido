import test from 'ava';
import 'babel/register';
import { spawn } from 'child_process';
import { readFileSync } from 'fs';

process.chdir(__dirname);

test('cli version', t => {
  const cp = spawn('../lib/bin/cli.js', ['--version'], {
    stdio: [process.stdin, null, null],
  });

  cp.stdout.setEncoding('utf8');
  cp.stdout.on('data', data => {
    const regex = new RegExp(require('../package.json').version);
    t.assert(regex.test(data), data);
    t.end();
  });
});

test('cli help', t => {
  const fixture = readFileSync('./fixture/help.txt', { encoding: 'utf8' });
  const cp = spawn('../lib/bin/cli.js', ['--help'], {
    stdio: [process.stdin, null, null],
  });

  cp.stdout.setEncoding('utf8');
  cp.stdout.on('data', data => {
    t.same(data, fixture);
    t.end();
  });
});

test('cli input', t => {
  const cp = spawn('../lib/bin/cli.js', ['-i 1020286000', '-n Reactive', '-c us de'], {
    stdio: [process.stdin, null, null],
  });

  cp.stdout.setEncoding('utf8');
  cp.stdout.on('data', data => {
    t.ok(data);
    t.end();
  });
});
