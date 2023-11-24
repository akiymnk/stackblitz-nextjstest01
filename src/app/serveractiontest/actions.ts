'use server';

export async function test(data: any) {
  console.log('action ! test, ', data);
  return { test: 'aaaa', bbb: 'bbbb' };
}
