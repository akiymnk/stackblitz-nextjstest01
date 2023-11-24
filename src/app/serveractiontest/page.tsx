'use client';

import { test } from './actions';

export default function ServerActionTest() {
  return (
    <>
      <div>
        test!
        <div>
          <button
            className="btn btn-primary"
            onClick={async () => {
              const a = await test({ bvvv: 'aaaa' });
              console.log('page! ', a);
            }}
          >
            てすと
          </button>
        </div>
      </div>
    </>
  );
}
