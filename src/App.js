import { useState, useEffect } from "react";

const initialItems = `BuiltRight
Tourii
Fair
Subbb
Beacon
Parb AI
Outbound Aero
Yura Health
Tarmac
Wysper
Tatch
Professor AI
Halluminate
Xcap
LinSha TechWorks
Zero-True
10 Clear
TeddyBot
Tiny Dinner
Peepalytics
Geenuity
Panacea
Share
Zipps
OpenForge
Superlocal
Advata
GreatWeek
Commander AI
Dopplio
CTRL Panel
Mixo
Hyperfan
Plus One
Boom AI
Invisibility
Xylic Data
ScienceBank
ShopKit
Rebar Radar
Marc-Johann
AltMind
Polaris
Monocle
Lighthouse`;

const items = [];

const App = () => {
  const [isSorting, setIsSorting] = useState(false);
  const [editableItemList, setEditableItemList] = useState(initialItems);
  const [stack, setStack] = useState([]);
  const [stackIndex, setStackIndex] = useState(-1);
  const [stackTotal, setStackTotal] = useState(0);
  const [stackProgress, setStackProgress] = useState(0);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [k, setK] = useState(0);

  const mergeSort = (l, r) => {
    let merges = [];
    let total = 0;
    if (l < r) {
      const m = Math.floor(l + (r - l) / 2);
      const { merges: leftMerges, total: leftTotal } = mergeSort(l, m);
      const { merges: rightMerges, total: rightTotal } = mergeSort(m + 1, r);
      merges = [...leftMerges, ...rightMerges, { l, m, r }];
      total = r - l + leftTotal + rightTotal + 1;
    }
    return { merges, total };
  };

  const start = () => {
    const { merges, total } = mergeSort(0, items.length - 1);
    setStack(merges);
    setStackTotal(total);
    console.log("starting!");
    setStackIndex(0);
    setIsSorting(true);
  };

  useEffect(() => {
    if (stackIndex == -1) return;
    const { l, m, r } = stack[stackIndex] || {};
    setLeft(items.slice(l, m + 1));
    setRight(items.slice(m + 1, r + 1));
    setI(0);
    setJ(0);
    setK(l);
  }, [stackIndex]);

  useEffect(() => {
    console.log("CHECKING MERGE", {
      stackIndex,
      i,
      j,
      k,
      left: left,
      right: right,
    });

    if (i < left.length && j < right.length) return;
    if (i < left.length) {
      items[k] = left[i];
      setI(i + 1);
      setK(k + 1);
      setStackProgress(stackProgress + 1);
      return;
    } else if (j < right.length) {
      items[k] = right[j];
      setJ(j + 1);
      setK(k + 1);
      setStackProgress(stackProgress + 1);
      return;
    }
    if (i >= left.length && j >= right.length) {
      setStackIndex(stackIndex + 1);
    }
  }, [k]);

  if (!isSorting) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <div className="text-2xl">Rank Anything</div>
        <div className="text-xs">Enter items separated by a new line</div>
        <textarea
          className="border-2 border-gray p-2 w-full max-w-md h-full"
          value={editableItemList}
          onChange={(e) => {
            setEditableItemList(e.target.value);
          }}
        />
        <div
          className="cursor-pointer p-2 border-2 border-gray mt-4"
          onClick={() => {
            const array = editableItemList.split("\n");
            const shuffleArray = (array) => {
              for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
              }
            };
            shuffleArray(array);
            items.push(...array.filter((item) => item.trim().length > 0));
            start();
          }}
        >
          Start!
        </div>
      </div>
    );
  }

  return (
    <div className="flex md:flex-row flex-col h-full w-full p-20 gap-10">
      <div className="md:w-2/3 text-center">
        {stackIndex >= stack.length ? (
          <div className="flex flex-col justify-center items-center">
            <div className="text-center">Done!</div>
            <div
              className="cursor-pointer p-2 border-2 border-gray mt-4"
              onClick={() => {
                window.location.reload();
              }}
            >
              Restart
            </div>
          </div>
        ) : (
          <>
            <div className="text-xl">Which one do you prefer?</div>
            <div className="text-xs">
              Progress: {((stackProgress / stackTotal) * 100).toFixed(2)}%
            </div>
            <div className="flex flex-row w-full mt-20 gap-4">
              <div className="w-1/2 text-center">
                <div
                  className="cursor-pointer p-5 border-2 border-gray"
                  onClick={() => {
                    items[k] = left[i];
                    setI(i + 1);
                    setK(k + 1);
                    setStackProgress(stackProgress + 1);
                  }}
                >
                  {left[i]}
                </div>
              </div>
              <div className="w-1/2 text-center">
                <div
                  className="cursor-pointer p-5 border-2 border-gray"
                  onClick={() => {
                    items[k] = right[j];
                    setJ(j + 1);
                    setK(k + 1);
                    setStackProgress(stackProgress + 1);
                  }}
                >
                  {right[j]}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="md:w-1/3 h-full">
        <ul className="overflow-y-scroll h-full">
          {items.map((item, index) => {
            const { l, m, r } = stack[stackIndex] || {};
            const isMerging = index >= k && index <= r;
            return (
              <li key={index} className={isMerging ? "text-red-500" : ""}>
                {index + 1}: {isMerging ? "" : item}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default App;
