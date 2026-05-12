export const LEVELS = [
  { id: "foundation", name: "基础巩固", note: "先确认课本核心概念" },
  { id: "variant", name: "变式提高", note: "换条件、换问法、练迁移" },
  { id: "thinking", name: "思维拓展", note: "重推理、找规律、说理由" },
  { id: "mixed", name: "综合练习", note: "跨单元混合训练" }
];

export const chapters = [
  {
    id: "time",
    order: 1,
    title: "时间在哪里",
    page: "课本第1页起",
    focus: "读钟表、时分秒关系、经过时间、生活安排",
    thinkingFocus: "从线索反推时间，比较不同安排是否来得及。",
    points: ["认识时针、分针、秒针", "1时=60分，1分=60秒", "读写几时几分", "计算经过时间", "安排一天中的活动"]
  },
  {
    id: "remainder",
    order: 2,
    title: "有余数的除法",
    page: "课本第10页起",
    focus: "平均分、余数含义、余数小于除数、周期问题",
    thinkingFocus: "把剩余、循环、够不够、至少几个转化成除法问题。",
    points: ["平均分后有剩余", "商和余数表示什么", "余数必须比除数小", "至少问题与进一法", "按周期找第几个"]
  },
  {
    id: "relations",
    order: 3,
    title: "数量间的乘除关系",
    page: "课本第24页起",
    focus: "每份数、份数、总数，倍数关系，乘除互逆",
    thinkingFocus: "画关系图，把多步数量关系拆成一份一份。",
    points: ["每份数×份数=总数", "总数÷份数=每份数", "总数÷每份数=份数", "几倍关系", "用乘除法反推未知量"]
  },
  {
    id: "numbers",
    order: 4,
    title: "万以内数的认识",
    page: "课本第40页起",
    focus: "数位、组成、读写、比较、估计",
    thinkingFocus: "根据多个条件确定一个数，训练有序尝试和排除。",
    points: ["千、百、十、个的数位", "数的组成", "读数和写数", "比较大小", "近似数和估计"]
  },
  {
    id: "addsub",
    order: 5,
    title: "万以内的加法和减法",
    page: "课本第63页起",
    focus: "口算、笔算、估算、验算、解决问题",
    thinkingFocus: "理解和差变化、缺数字算式、多步生活问题。",
    points: ["三位数加减法", "进位与退位", "估算是否合理", "用加减法解决问题", "根据结果反推条件"]
  },
  {
    id: "comics",
    order: 6,
    title: "数学连环画",
    page: "课本第83页起",
    focus: "读图、找信息、连续情境、提出问题",
    thinkingFocus: "从故事中筛选有用条件，自己提出并解决问题。",
    points: ["按顺序读图", "找有用信息", "补充缺少条件", "提出数学问题", "解释自己的想法"]
  },
  {
    id: "review",
    order: 7,
    title: "复习与关联",
    page: "课本第87页起",
    focus: "把时间、除法、数位、加减法联系起来",
    thinkingFocus: "综合条件多，先分类整理，再分步解决。",
    points: ["跨单元综合", "选择合适方法", "检查答案是否合理", "用多种方法解释", "整理薄弱点"]
  }
];

const names = ["小云", "聪聪", "明明", "乐乐", "安安", "可可"];
const objects = ["贴纸", "彩笔", "积木", "卡片", "书签", "小旗"];
const places = ["图书角", "体育馆", "科技馆", "少年宫", "公园", "教室"];
const colors = ["红", "黄", "蓝", "绿", "紫", "橙"];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choice(items) {
  return items[randInt(0, items.length - 1)];
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function formatTime(totalMinutes) {
  const minutesInDay = 24 * 60;
  const normalized = ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay;
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  if (minute === 0) return `${hour}时`;
  return `${hour}时${minute}分`;
}

function digitalTime(totalMinutes) {
  const minutesInDay = 24 * 60;
  const normalized = ((totalMinutes % minutesInDay) + minutesInDay) % minutesInDay;
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  return `${pad2(hour)}:${pad2(minute)}`;
}

function levelName(level) {
  return LEVELS.find((item) => item.id === level)?.name ?? "练习";
}

function makeQuestion(template, payload) {
  return {
    id: `${template.id}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    templateId: template.id,
    chapterId: template.chapterId,
    chapterName: getChapter(template.chapterId)?.title ?? "",
    level: template.level,
    levelName: levelName(template.level),
    skill: template.skill,
    title: template.title,
    userAnswer: "",
    ...payload
  };
}

export function getChapter(id) {
  return chapters.find((chapter) => chapter.id === id);
}

export const templates = [
  {
    id: "time-read-clock",
    chapterId: "time",
    level: "foundation",
    skill: "读写时间",
    title: "认读钟面",
    factory(template) {
      const hour = randInt(1, 11);
      const minute = choice([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
      const minuteMark = minute === 0 ? "12" : String(minute / 5);
      return makeQuestion(template, {
        question: `钟面上，时针刚过${hour}，分针指向${minuteMark}。这个时间是多少？请写成“几时几分”。`,
        answer: formatTime(hour * 60 + minute),
        hints: ["先看时针，确定是几时多。", "分针指向几，就表示走了几个5分。"],
        steps: [
          `时针刚过${hour}，说明是${hour}时多。`,
          `分针指向${minuteMark}，表示${minute}分。`,
          `所以时间是${formatTime(hour * 60 + minute)}。`
        ],
        extension: `如果分针再走10分钟，时间会变成${formatTime(hour * 60 + minute + 10)}。`
      });
    }
  },
  {
    id: "time-conversion",
    chapterId: "time",
    level: "foundation",
    skill: "时分秒换算",
    title: "时间单位换算",
    factory(template) {
      const mode = choice(["hm", "ms", "half"]);
      if (mode === "hm") {
        const hours = randInt(1, 3);
        const minutes = choice([5, 10, 15, 20, 30, 40, 45, 50]);
        const total = hours * 60 + minutes;
        return makeQuestion(template, {
          question: `${hours}时${minutes}分一共是多少分？`,
          answer: `${total}分`,
          hints: ["1时=60分。", "先把几时换成几分，再加剩下的分。"],
          steps: [`${hours}时=${hours * 60}分。`, `${hours * 60}分+${minutes}分=${total}分。`],
          extension: `反过来，${total}分可以说成${hours}时${minutes}分。`
        });
      }
      if (mode === "ms") {
        const minutes = randInt(2, 8);
        const total = minutes * 60;
        return makeQuestion(template, {
          question: `${minutes}分等于多少秒？`,
          answer: `${total}秒`,
          hints: ["1分=60秒。", "几分就是几个60秒。"],
          steps: [`${minutes}分里面有${minutes}个60秒。`, `${minutes}×60=${total}，所以是${total}秒。`],
          extension: `${total + 30}秒可以说成${minutes}分30秒。`
        });
      }
      const halfHours = randInt(1, 4);
      const total = halfHours * 30;
      return makeQuestion(template, {
        question: `${halfHours}个半小时一共是多少分？`,
        answer: `${total}分`,
        hints: ["半小时是30分。", "几个半小时就是几个30分。"],
        steps: [`1个半小时=30分。`, `${halfHours}个半小时=${halfHours}×30=${total}分。`],
        extension: `如果再增加半小时，就一共是${total + 30}分。`
      });
    }
  },
  {
    id: "time-elapsed",
    chapterId: "time",
    level: "variant",
    skill: "经过时间",
    title: "活动结束时间",
    factory(template) {
      const start = randInt(7 * 60 + 10, 10 * 60 + 30);
      const duration = choice([15, 20, 25, 30, 35, 40, 45, 50]);
      const who = choice(names);
      const activity = choice(["阅读", "练字", "做口算", "整理书包", "跳绳"]);
      return makeQuestion(template, {
        question: `${who}${digitalTime(start)}开始${activity}，用了${duration}分钟。${who}什么时候结束？`,
        answer: `${formatTime(start + duration)}（${digitalTime(start + duration)}）`,
        hints: ["结束时间=开始时间+经过的时间。", "如果分钟超过60，要向小时进1。"],
        steps: [
          `开始时间是${formatTime(start)}。`,
          `加上${duration}分钟：${digitalTime(start)}+${duration}分=${digitalTime(start + duration)}。`,
          `所以结束时间是${formatTime(start + duration)}。`
        ],
        extension: `如果${who}提前5分钟开始，结束时间会是${formatTime(start + duration - 5)}。`
      });
    }
  },
  {
    id: "time-deadline",
    chapterId: "time",
    level: "variant",
    skill: "时间安排",
    title: "来得及吗",
    factory(template) {
      const start = randInt(16 * 60, 18 * 60);
      const first = choice([12, 15, 18, 20, 25]);
      const second = choice([15, 20, 25, 30, 35]);
      const rest = choice([5, 8, 10]);
      const finish = start + first + rest + second;
      const deadline = finish + choice([-5, 0, 5, 10, 15]);
      const result = finish <= deadline ? "来得及" : "来不及";
      return makeQuestion(template, {
        question: `放学后，${choice(names)}${digitalTime(start)}开始先做${first}分钟口算，中间休息${rest}分钟，再做${second}分钟阅读。${digitalTime(deadline)}前要出门，来得及吗？`,
        answer: `${result}。全部做完是${formatTime(finish)}，和出门时间${formatTime(deadline)}比较。`,
        hints: ["先算一共需要多少分钟。", "再算做完的时间，最后和出门时间比较。"],
        steps: [
          `总时间=${first}+${rest}+${second}=${first + rest + second}分。`,
          `${digitalTime(start)}+${first + rest + second}分=${digitalTime(finish)}。`,
          `${digitalTime(finish)} ${finish <= deadline ? "不晚于" : "晚于"} ${digitalTime(deadline)}，所以${result}。`
        ],
        extension: `如果想提前10分钟出门，最晚应在${formatTime(deadline - 10 - (first + rest + second))}开始。`
      });
    }
  },
  {
    id: "time-reverse-plan",
    chapterId: "time",
    level: "thinking",
    skill: "逆推时间",
    title: "从结束反推开始",
    factory(template) {
      const reading = choice([12, 15, 18, 20]);
      const breakTime = choice([4, 5, 6, 8]);
      const math = choice([18, 20, 24, 25, 30]);
      const finish = randInt(19 * 60, 20 * 60 + 20);
      const start = finish - reading - breakTime - math;
      const who = choice(names);
      return makeQuestion(template, {
        question: `${who}晚上先读书${reading}分钟，休息${breakTime}分钟，再做一道思维题${math}分钟，全部完成时是${digitalTime(finish)}。${who}最开始是几点开始读书的？`,
        answer: `${formatTime(start)}（${digitalTime(start)}）`,
        hints: ["这道题要倒着想。", "从完成时间依次减去做题、休息、读书的时间。"],
        steps: [
          `一共用了${reading}+${breakTime}+${math}=${reading + breakTime + math}分。`,
          `开始时间=完成时间-总用时。`,
          `${digitalTime(finish)}-${reading + breakTime + math}分=${digitalTime(start)}。`
        ],
        extension: `如果思维题多用了5分钟，开始时间不变，完成时间会变成${formatTime(finish + 5)}。`
      });
    }
  },
  {
    id: "remainder-share",
    chapterId: "remainder",
    level: "foundation",
    skill: "有余数除法含义",
    title: "平均分后剩多少",
    factory(template) {
      const divisor = randInt(3, 8);
      const quotient = randInt(4, 9);
      const remainder = randInt(1, divisor - 1);
      const total = divisor * quotient + remainder;
      const item = choice(objects);
      return makeQuestion(template, {
        question: `有${total}个${item}，每${divisor}个分成一组，可以分成几组？还剩几个？`,
        answer: `${quotient}组，还剩${remainder}个。算式：${total}÷${divisor}=${quotient}……${remainder}。`,
        hints: ["想一想几个除数相加最接近总数，但不能超过。", "余数就是分完后不够再分一组的数量。"],
        steps: [`${divisor}×${quotient}=${divisor * quotient}。`, `${total}-${divisor * quotient}=${remainder}。`, `所以可以分${quotient}组，还剩${remainder}个。`],
        extension: `如果再增加${divisor - remainder}个${item}，就能正好多分1组。`
      });
    }
  },
  {
    id: "remainder-rule",
    chapterId: "remainder",
    level: "foundation",
    skill: "余数小于除数",
    title: "余数可能是多少",
    factory(template) {
      const divisor = randInt(4, 9);
      const possible = Array.from({ length: divisor - 1 }, (_, index) => index + 1);
      return makeQuestion(template, {
        question: `一个除法算式的除数是${divisor}，如果有余数，余数可能是哪些数？为什么？`,
        answer: possible.join("、"),
        hints: ["余数一定比除数小。", "如果余数等于或大于除数，就还能再分一组。"],
        steps: [`除数是${divisor}，余数必须小于${divisor}。`, `有余数时，不能是0，所以可能是${possible.join("、")}。`],
        extension: `如果余数是${divisor}，说明还可以再分1组，所以写法不正确。`
      });
    }
  },
  {
    id: "remainder-boxes",
    chapterId: "remainder",
    level: "variant",
    skill: "至少问题",
    title: "至少需要几个",
    factory(template) {
      const capacity = randInt(4, 9);
      const full = randInt(5, 11);
      const remainder = randInt(1, capacity - 1);
      const total = capacity * full + remainder;
      const item = choice(["苹果", "橘子", "本子", "奖章", "乒乓球"]);
      return makeQuestion(template, {
        question: `有${total}个${item}，每个盒子最多装${capacity}个。至少需要几个盒子？`,
        answer: `${full + 1}个盒子。`,
        hints: ["先看能装满几个盒子。", "剩下的物品虽然不满一盒，也需要一个盒子。"],
        steps: [
          `${total}÷${capacity}=${full}……${remainder}。`,
          `能装满${full}个盒子，还剩${remainder}个。`,
          `剩下的也要装，所以至少需要${full + 1}个盒子。`
        ],
        extension: `如果只准备${full}个盒子，会有${remainder}个${item}没有地方装。`
      });
    }
  },
  {
    id: "remainder-cycle",
    chapterId: "remainder",
    level: "thinking",
    skill: "周期推理",
    title: "第几个是什么",
    factory(template) {
      const cycleLength = randInt(3, 5);
      const cycle = shuffle(colors).slice(0, cycleLength);
      const index = randInt(18, 58);
      const remainder = index % cycleLength;
      const answerIndex = remainder === 0 ? cycleLength - 1 : remainder - 1;
      return makeQuestion(template, {
        question: `彩灯按“${cycle.join("、")}”的顺序一盏一盏排列，并不断重复。第${index}盏彩灯是什么颜色？`,
        answer: `${cycle[answerIndex]}色。`,
        hints: ["把一组重复的颜色看成一个周期。", "用第几个除以一组有几个，看余数。余数为0时看这一组最后一个。"],
        steps: [
          `一组有${cycleLength}盏。`,
          `${index}÷${cycleLength}=${Math.floor(index / cycleLength)}……${remainder}。`,
          remainder === 0 ? `没有余数，说明第${index}盏是一组里的最后一盏，是${cycle[answerIndex]}色。` : `余数是${remainder}，说明是这一组里的第${remainder}盏，是${cycle[answerIndex]}色。`
        ],
        extension: `第${index + cycleLength}盏和第${index}盏颜色相同，因为相差正好1个周期。`
      });
    }
  },
  {
    id: "remainder-color-box",
    chapterId: "remainder",
    level: "thinking",
    skill: "彩色分组推理",
    title: "彩色收纳盒",
    factory(template) {
      const groupSize = randInt(4, 7);
      const fullGroups = randInt(4, 8);
      const blue = groupSize * fullGroups + randInt(1, groupSize - 1);
      const yellow = groupSize * randInt(2, 5);
      const remainder = blue % groupSize;
      return makeQuestion(template, {
        question: `彩色收纳盒规定：每盒正好放${groupSize}张同色卡片。蓝色卡片有${blue}张，黄色卡片有${yellow}张。只看蓝色卡片，可以装满几盒？还剩几张？黄色卡片会影响蓝色卡片的答案吗？`,
        answer: `蓝色卡片可以装满${Math.floor(blue / groupSize)}盒，还剩${remainder}张。黄色卡片不影响蓝色卡片的分组。`,
        hints: ["题目问蓝色卡片，就先只看蓝色数量。", "用蓝色卡片数量除以每盒张数。"],
        steps: [
          `蓝色卡片：${blue}÷${groupSize}=${Math.floor(blue / groupSize)}……${remainder}。`,
          `所以蓝色卡片装满${Math.floor(blue / groupSize)}盒，还剩${remainder}张。`,
          `黄色卡片是另一种颜色，不参与蓝色卡片的分组。`
        ],
        extension: `如果把黄色卡片也单独装盒，黄色卡片可以装满${yellow / groupSize}盒。`,
        visual: {
          type: "grouping",
          label: "蓝色分组盒",
          total: blue,
          groupSize
        }
      });
    }
  },
  {
    id: "remainder-inverse",
    chapterId: "remainder",
    level: "thinking",
    skill: "根据商和余数反推",
    title: "反推被除数",
    factory(template) {
      const divisor = randInt(4, 9);
      const quotient = randInt(5, 12);
      const remainder = randInt(1, divisor - 1);
      const total = divisor * quotient + remainder;
      return makeQuestion(template, {
        question: `一个数除以${divisor}，商是${quotient}，余数是${remainder}。这个数是多少？`,
        answer: `${total}`,
        hints: ["被除数=除数×商+余数。", "先算分成整组的数量，再加剩下的。"],
        steps: [`${divisor}×${quotient}=${divisor * quotient}。`, `${divisor * quotient}+${remainder}=${total}。`, `所以这个数是${total}。`],
        extension: `如果余数改成${Math.max(1, remainder - 1)}，这个数会变成${divisor * quotient + Math.max(1, remainder - 1)}。`
      });
    }
  },
  {
    id: "relations-groups",
    chapterId: "relations",
    level: "foundation",
    skill: "每份数、份数、总数",
    title: "看关系选算法",
    factory(template) {
      const per = randInt(3, 9);
      const groups = randInt(4, 8);
      const total = per * groups;
      const item = choice(objects);
      return makeQuestion(template, {
        question: `每袋有${per}个${item}，一共有${groups}袋。共有多少个${item}？如果把这些${item}平均分给${groups}个小朋友，每人得几个？`,
        answer: `共有${total}个；每人得${per}个。`,
        hints: ["先求总数，用乘法。", "再平均分，用除法。"],
        steps: [`总数：${per}×${groups}=${total}。`, `平均分：${total}÷${groups}=${per}。`],
        extension: `这说明乘法和除法可以互相检查。`
      });
    }
  },
  {
    id: "relations-times-difference",
    chapterId: "relations",
    level: "variant",
    skill: "倍数与份数",
    title: "多出来的是几份",
    factory(template) {
      const base = randInt(4, 12);
      const times = randInt(2, 5);
      const diff = base * (times - 1);
      const item = choice(["花", "贴纸", "贝壳", "星星卡"]);
      return makeQuestion(template, {
        question: `红${item}的数量是黄${item}的${times}倍，红${item}比黄${item}多${diff}个。黄${item}和红${item}各有多少个？`,
        answer: `黄${item}${base}个，红${item}${base * times}个。`,
        hints: ["把黄的数量看成1份，红的数量就是几份。", "多出来的数量对应“几倍-1”份。"],
        steps: [
          `黄${item}=1份，红${item}=${times}份。`,
          `红比黄多${times - 1}份，这${times - 1}份是${diff}个。`,
          `1份=${diff}÷${times - 1}=${base}个。`,
          `红${item}=${base}×${times}=${base * times}个。`
        ],
        extension: `如果红${item}是黄${item}的${times + 1}倍，并且黄${item}还是${base}个，红${item}会有${base * (times + 1)}个。`
      });
    }
  },
  {
    id: "relations-chain",
    chapterId: "relations",
    level: "variant",
    skill: "多步乘除关系",
    title: "关系链",
    factory(template) {
      const tables = randInt(3, 6);
      const perTable = randInt(4, 8);
      const total = tables * perTable;
      const leave = randInt(2, Math.min(9, total - 6));
      const left = total - leave;
      return makeQuestion(template, {
        question: `手工课有${tables}张桌子，每张桌子坐${perTable}人。后来有${leave}人去取材料，教室里还剩多少人？`,
        answer: `${left}人。`,
        hints: ["先求原来一共有多少人。", "再减去离开的人数。"],
        steps: [`原来共有${tables}×${perTable}=${total}人。`, `离开${leave}人，还剩${total}-${leave}=${left}人。`],
        extension: `如果每张桌子少坐1人，原来会少${tables}人。`
      });
    }
  },
  {
    id: "relations-transfer",
    chapterId: "relations",
    level: "thinking",
    skill: "变化推理",
    title: "一来一去差多少",
    factory(template) {
      const moved = randInt(3, 12);
      const diff = moved * 2;
      return makeQuestion(template, {
        question: `甲、乙两个盒子里原来有同样多的彩笔。从甲盒拿出${moved}支放到乙盒后，乙盒比甲盒多多少支？`,
        answer: `${diff}支。`,
        hints: ["甲少了几支，乙多了几支。", "差距由两部分组成：甲少的和乙多的。"],
        steps: [
          `甲盒少了${moved}支。`,
          `乙盒多了${moved}支。`,
          `两盒相差${moved}+${moved}=${diff}支。`
        ],
        extension: `如果乙盒现在比甲盒多${diff + 4}支，说明可能从甲盒拿了${(diff + 4) / 2}支给乙盒。`
      });
    }
  },
  {
    id: "relations-unknown",
    chapterId: "relations",
    level: "thinking",
    skill: "反推未知量",
    title: "先倒着算",
    factory(template) {
      const start = randInt(6, 18);
      const times = randInt(2, 4);
      const add = randInt(3, 12);
      const result = start * times + add;
      const item = choice(objects);
      return makeQuestion(template, {
        question: `${choice(names)}原来有一些${item}，后来数量变成原来的${times}倍，又得到${add}个，现在有${result}个。原来有多少个${item}？`,
        answer: `${start}个。`,
        hints: ["这道题要倒着算。", "先减去后来得到的，再除以倍数。"],
        steps: [`先去掉后来得到的：${result}-${add}=${result - add}。`, `这是原来的${times}倍，所以原来有${result - add}÷${times}=${start}个。`],
        extension: `如果最后不是得到${add}个，而是得到${add + 2}个，现在就会有${result + 2}个。`
      });
    }
  },
  {
    id: "numbers-compose",
    chapterId: "numbers",
    level: "foundation",
    skill: "数的组成",
    title: "几个千百十个",
    factory(template) {
      const thousands = randInt(1, 9);
      const hundreds = randInt(0, 9);
      const tens = randInt(0, 9);
      const ones = randInt(0, 9);
      const number = thousands * 1000 + hundreds * 100 + tens * 10 + ones;
      return makeQuestion(template, {
        question: `${number}里面有几个千、几个百、几个十和几个一？`,
        answer: `${thousands}个千、${hundreds}个百、${tens}个十、${ones}个一。`,
        hints: ["从左到右看数位：千位、百位、十位、个位。", "每个数位上的数字表示有几个这样的计数单位。"],
        steps: [`${number}的千位是${thousands}，百位是${hundreds}，十位是${tens}，个位是${ones}。`],
        extension: `如果十位增加1，这个数会增加10，变成${number + 10}。`
      });
    }
  },
  {
    id: "numbers-order",
    chapterId: "numbers",
    level: "foundation",
    skill: "比较大小",
    title: "给数排队",
    factory(template) {
      const nums = shuffle([randInt(1000, 2999), randInt(3000, 4999), randInt(5000, 6999), randInt(7000, 9999)]);
      const sorted = [...nums].sort((a, b) => a - b);
      return makeQuestion(template, {
        question: `把下面这些数从小到大排列：${nums.join("、")}。`,
        answer: sorted.join(" < "),
        hints: ["先比千位。", "千位相同再比百位、十位、个位。"],
        steps: [`这些数的千位分别是${nums.map((n) => Math.floor(n / 1000)).join("、")}。`, `按从小到大排列是：${sorted.join("、")}。`],
        extension: `最大数和最小数相差${sorted[sorted.length - 1] - sorted[0]}。`
      });
    }
  },
  {
    id: "numbers-build",
    chapterId: "numbers",
    level: "variant",
    skill: "组数",
    title: "用数字组数",
    factory(template) {
      const digits = shuffle([randInt(1, 9), randInt(0, 9), randInt(0, 9), randInt(0, 9)]);
      if (new Set(digits).size < 4) digits[3] = (digits[3] + 3) % 10;
      const valid = [...digits];
      const max = [...valid].sort((a, b) => b - a).join("");
      const minDigits = [...valid].sort((a, b) => a - b);
      if (minDigits[0] === 0) {
        const firstNonZero = minDigits.findIndex((digit) => digit !== 0);
        [minDigits[0], minDigits[firstNonZero]] = [minDigits[firstNonZero], minDigits[0]];
      }
      const min = minDigits.join("");
      return makeQuestion(template, {
        question: `用数字${valid.join("、")}各用一次，能组成的最大四位数和最小四位数分别是多少？`,
        answer: `最大是${max}，最小是${min}。`,
        hints: ["最大数：大的数字放高位。", "最小四位数：最小的非0数字放千位，再把其他数字从小到大排。"],
        steps: [`最大数把数字从大到小排：${max}。`, `最小四位数不能以0开头，排成：${min}。`],
        extension: `这两个数相差${Number(max) - Number(min)}。`
      });
    }
  },
  {
    id: "numbers-hidden-digit",
    chapterId: "numbers",
    level: "variant",
    skill: "数位条件",
    title: "方框里能填几",
    factory(template) {
      const hundreds = randInt(2, 8);
      const threshold = randInt(2, 7);
      const direction = choice(["greater", "less"]);
      const ones = randInt(0, 9);
      const target = hundreds * 100 + threshold * 10 + ones;
      const options = direction === "greater"
        ? Array.from({ length: 9 - threshold }, (_, index) => threshold + 1 + index)
        : Array.from({ length: threshold }, (_, index) => index);
      const sign = direction === "greater" ? ">" : "<";
      return makeQuestion(template, {
        question: `在${hundreds}□${ones} ${sign} ${target}中，□里可以填哪些数字？`,
        answer: options.join("、"),
        hints: ["百位和个位相同，关键看十位。", direction === "greater" ? "要让左边更大，十位要比目标数的十位大。" : "要让左边更小，十位要比目标数的十位小。"],
        steps: [
          `两个数百位都是${hundreds}，个位都是${ones}。`,
          `只需要比较十位。`,
          direction === "greater" ? `□要大于${threshold}，所以可以填${options.join("、")}。` : `□要小于${threshold}，所以可以填${options.join("、")}。`
        ],
        extension: `如果把符号换成“=”，□只能填${threshold}。`
      });
    }
  },
  {
    id: "numbers-color-place",
    chapterId: "numbers",
    level: "thinking",
    skill: "彩色数位推理",
    title: "彩色数位车",
    factory(template) {
      const thousands = randInt(1, 9);
      const hundreds = randInt(1, 9);
      const tens = randInt(1, 9);
      const ones = randInt(0, 9);
      const number = thousands * 1000 + hundreds * 100 + tens * 10 + ones;
      const focus = choice([
        { color: "橙色", place: "百位", digit: hundreds, unit: "百" },
        { color: "绿色", place: "十位", digit: tens, unit: "十" },
        { color: "粉色", place: "个位", digit: ones, unit: "一" }
      ]);
      return makeQuestion(template, {
        question: `彩色数位车上，紫色车厢是千位，橙色车厢是百位，绿色车厢是十位，粉色车厢是个位。车厢里的数字组成${number}。${focus.color}车厢里的数字表示几个${focus.unit}？这个数是多少？`,
        answer: `${focus.color}车厢在${focus.place}，数字是${focus.digit}，表示${focus.digit}个${focus.unit}；这个数是${number}。`,
        hints: ["先根据颜色找到对应的数位。", "同一个数字放在不同数位，表示的意义不同。"],
        steps: [
          `紫色、橙色、绿色、粉色依次表示千位、百位、十位、个位。`,
          `${focus.color}对应${focus.place}，车厢里的数字是${focus.digit}。`,
          `所以它表示${focus.digit}个${focus.unit}，整个数是${number}。`
        ],
        extension: `如果把绿色车厢的数字增加1，这个数会增加10，变成${number + 10}。`,
        visual: {
          type: "place-value",
          label: "彩色数位车",
          number,
          digits: [thousands, hundreds, tens, ones]
        }
      });
    }
  },
  {
    id: "numbers-riddle",
    chapterId: "numbers",
    level: "thinking",
    skill: "数字谜",
    title: "猜一个四位数",
    factory(template) {
      const thousands = randInt(2, 8);
      const tens = randInt(0, 7);
      const hundreds = tens + 2;
      const ones = thousands;
      const number = thousands * 1000 + hundreds * 100 + tens * 10 + ones;
      return makeQuestion(template, {
        question: `一个四位数，千位和个位相同，都是${thousands}；百位比十位大2；百位和十位上的数字合起来是${hundreds + tens}。这个数是多少？`,
        answer: `${number}`,
        hints: ["先找十位和百位。", "两个数相差2，和是题目给出的数。"],
        steps: [
          `百位比十位大2，百位+十位=${hundreds + tens}。`,
          `可以想：${tens}+${hundreds}=${hundreds + tens}，并且${hundreds}-${tens}=2。`,
          `所以百位是${hundreds}，十位是${tens}。`,
          `千位和个位都是${thousands}，这个数是${number}。`
        ],
        extension: `如果只给“百位比十位大2”，不告诉它们的和，答案就不唯一。`
      });
    }
  },
  {
    id: "addsub-column",
    chapterId: "addsub",
    level: "foundation",
    skill: "三位数加减法",
    title: "算一算并验算",
    factory(template) {
      const a = randInt(260, 780);
      const b = randInt(120, Math.min(950 - a, 360));
      const sum = a + b;
      const mode = choice(["add", "sub"]);
      if (mode === "add") {
        return makeQuestion(template, {
          question: `计算：${a}+${b}=? 请用减法验算。`,
          answer: `${sum}。验算：${sum}-${b}=${a}。`,
          hints: ["相同数位对齐。", "个位满十向十位进1，十位满十向百位进1。"],
          steps: [`先算${a}+${b}=${sum}。`, `用${sum}-${b}=${a}验算，说明计算正确。`],
          extension: `也可以用${sum}-${a}=${b}验算。`
        });
      }
      return makeQuestion(template, {
        question: `计算：${sum}-${a}=? 请用加法验算。`,
        answer: `${b}。验算：${b}+${a}=${sum}。`,
        hints: ["相同数位对齐。", "减法可以用加法验算。"],
        steps: [`${sum}-${a}=${b}。`, `验算：${b}+${a}=${sum}。`],
        extension: `如果减数增加10，差会减少10，变成${Math.max(0, b - 10)}。`
      });
    }
  },
  {
    id: "addsub-estimate",
    chapterId: "addsub",
    level: "variant",
    skill: "估算",
    title: "够不够",
    factory(template) {
      const a = randInt(260, 480);
      const b = randInt(180, 390);
      const money = Math.round((a + b + choice([-60, -20, 30, 80])) / 10) * 10;
      const result = a + b <= money ? "够" : "不够";
      return makeQuestion(template, {
        question: `买一个书包${a}元，一套运动服${b}元。带${money}元够吗？请先估一估，再算一算。`,
        answer: `${result}。实际需要${a + b}元。`,
        hints: ["可以先把价格看成接近的整十或整百数。", "最后用准确计算检查。"],
        steps: [`准确计算：${a}+${b}=${a + b}元。`, `${a + b} ${a + b <= money ? "≤" : ">"} ${money}，所以${result}。`],
        extension: `如果还想买一本18元的本子，一共需要${a + b + 18}元。`
      });
    }
  },
  {
    id: "addsub-shopping",
    chapterId: "addsub",
    level: "variant",
    skill: "多步应用题",
    title: "购物找零",
    factory(template) {
      const first = randInt(128, 368);
      const second = randInt(96, 286);
      const pay = Math.ceil((first + second + randInt(20, 120)) / 100) * 100;
      const change = pay - first - second;
      return makeQuestion(template, {
        question: `妈妈买一盏台灯${first}元，又买一套书${second}元，付给售货员${pay}元，应找回多少元？`,
        answer: `${change}元。`,
        hints: ["先算一共花了多少钱。", "再用付的钱减去花的钱。"],
        steps: [`一共花了${first}+${second}=${first + second}元。`, `应找回${pay}-${first + second}=${change}元。`],
        extension: `如果台灯便宜20元，应找回${change + 20}元。`
      });
    }
  },
  {
    id: "addsub-color-tags",
    chapterId: "addsub",
    level: "thinking",
    skill: "彩色价签推理",
    title: "彩色商店任务",
    factory(template) {
      const red = randInt(120, 260);
      const blue = randInt(90, 230);
      const green = randInt(60, 180);
      const pay = Math.ceil((red + blue + randInt(40, 120)) / 50) * 50;
      const change = pay - red - blue;
      return makeQuestion(template, {
        question: `彩色商店里，红色价签是台灯${red}元，蓝色价签是书包${blue}元，绿色价签是画册${green}元。小云只买红色和蓝色价签的商品，付${pay}元，应找回多少元？绿色价签要不要参与计算？`,
        answer: `应找回${change}元。绿色价签不参与计算。`,
        hints: ["先看题目说买了哪两种颜色。", "没有买的绿色价签商品不用算进去。"],
        steps: [
          `红色和蓝色价签一共${red}+${blue}=${red + blue}元。`,
          `付${pay}元，应找回${pay}-${red + blue}=${change}元。`,
          `绿色价签商品没有买，所以不参与计算。`
        ],
        extension: `如果又买绿色价签的画册，一共要${red + blue + green}元。`,
        visual: {
          type: "shopping",
          label: "彩色价签",
          prices: [red, blue, green, pay],
          items: [
            { name: "红色台灯", color: "红", price: red },
            { name: "蓝色书包", color: "蓝", price: blue },
            { name: "绿色画册", color: "绿", price: green },
            { name: "付款", color: "黄", price: pay }
          ]
        }
      });
    }
  },
  {
    id: "addsub-missing-digit",
    chapterId: "addsub",
    level: "thinking",
    skill: "缺数字算式",
    title: "方框是几",
    factory(template) {
      const a = randInt(240, 680);
      const b = randInt(130, Math.min(280, 980 - a));
      const sum = a + b;
      const digits = String(a).split("");
      const pos = randInt(0, 2);
      const hidden = digits[pos];
      digits[pos] = "□";
      return makeQuestion(template, {
        question: `算式 ${digits.join("")}+${b}=${sum} 中，□里应填几？`,
        answer: `${hidden}`,
        hints: ["可以用和减去另一个加数，先求出被遮住的数。", "再看方框所在的数位。"],
        steps: [`${sum}-${b}=${a}。`, `所以被遮住的加数是${a}。`, `与${digits.join("")}比较，□=${hidden}。`],
        extension: `如果把另一个加数增加10，和也会增加10，变成${sum + 10}。`
      });
    }
  },
  {
    id: "addsub-difference-change",
    chapterId: "addsub",
    level: "thinking",
    skill: "和差变化",
    title: "不用重算",
    factory(template) {
      const a = randInt(520, 920);
      const b = randInt(120, 390);
      const delta = choice([10, 20, 30, 50, 100]);
      const diff = a - b;
      return makeQuestion(template, {
        question: `已知${a}-${b}=${diff}。如果被减数和减数都增加${delta}，新的差是多少？为什么？`,
        answer: `${diff}，因为两边同时增加同样多，差不变。`,
        hints: ["想一想两个人的钱都增加同样多，他们相差的钱会变吗？", "也可以写出新算式验证。"],
        steps: [`新算式是${a + delta}-${b + delta}。`, `被减数多了${delta}，减数也多了${delta}。`, `多出来的部分互相抵消，所以差还是${diff}。`],
        extension: `如果只让被减数增加${delta}，差会变成${diff + delta}。`
      });
    }
  },
  {
    id: "comics-sequence",
    chapterId: "comics",
    level: "foundation",
    skill: "连续情境",
    title: "读故事算数量",
    factory(template) {
      const start = randInt(18, 45);
      const add = randInt(6, 18);
      const use = randInt(5, start + add - 10);
      const left = start + add - use;
      const item = choice(objects);
      return makeQuestion(template, {
        question: `连环画里有三幅图：第一幅，桌上有${start}个${item}；第二幅，又拿来${add}个；第三幅，小朋友用了${use}个。最后还剩多少个${item}？`,
        answer: `${left}个。`,
        hints: ["按图的顺序算。", "先增加，再减少。"],
        steps: [`先有${start}个，又拿来${add}个：${start}+${add}=${start + add}。`, `用了${use}个，还剩${start + add}-${use}=${left}个。`],
        extension: `如果第三幅又用了${use + 2}个，就还剩${Math.max(0, left - 2)}个。`
      });
    }
  },
  {
    id: "comics-useful-info",
    chapterId: "comics",
    level: "variant",
    skill: "筛选信息",
    title: "哪些信息有用",
    factory(template) {
      const children = randInt(4, 8);
      const per = randInt(3, 7);
      const extra = randInt(2, 9);
      const total = children * per + extra;
      return makeQuestion(template, {
        question: `图中有${children}个小朋友，每人做${per}朵纸花，旁边有${extra}盒彩纸。要求“一共做了多少朵纸花”，哪些信息有用？答案是多少？`,
        answer: `有用信息是${children}个小朋友、每人${per}朵；一共${children * per}朵。${extra}盒彩纸暂时没有用。`,
        hints: ["问题问的是纸花数量，不是彩纸盒数。", "找和问题直接相关的信息。"],
        steps: [`每人${per}朵，有${children}人。`, `${children}×${per}=${children * per}朵。`, `${extra}盒彩纸没有参与计算。`],
        extension: `如果问题改成“还剩几盒彩纸”，就需要知道一开始有多少盒彩纸和用了多少盒。`
      });
    }
  },
  {
    id: "comics-make-question",
    chapterId: "comics",
    level: "thinking",
    skill: "提出问题",
    title: "自己提一个数学问题",
    factory(template) {
      const first = randInt(24, 48);
      const second = randInt(10, 26);
      const per = choice([4, 5, 6, 8]);
      const total = first + second;
      return makeQuestion(template, {
        question: `看图信息：上午借出${first}本书，下午借出${second}本书；每个书架能放${per}本新书。请你提出一个需要两步计算的数学问题，并解答。`,
        answer: `示例问题：一天一共借出多少本书？这些书如果每${per}本放一摞，可以放几摞，还剩几本？解答：${first}+${second}=${total}本，${total}÷${per}=${Math.floor(total / per)}……${total % per}。`,
        hints: ["先把上午和下午合起来。", "再用合起来的数量去解决第二个问题。"],
        steps: [`上午和下午共借出${first}+${second}=${total}本。`, `按每${per}本一摞：${total}÷${per}=${Math.floor(total / per)}……${total % per}。`],
        extension: `你还可以提出“下午比上午少借出多少本？”这样的一步问题。`
      });
    }
  },
  {
    id: "comics-hidden-condition",
    chapterId: "comics",
    level: "thinking",
    skill: "补条件",
    title: "缺了什么条件",
    factory(template) {
      const groups = randInt(3, 7);
      const per = randInt(4, 9);
      const total = groups * per;
      return makeQuestion(template, {
        question: `图中说：“同学们分组做实验，一共有${groups}组。”问题是“一共有多少人？”还缺少什么条件？如果补充“每组${per}人”，答案是多少？`,
        answer: `缺少每组有多少人。补充每组${per}人后，一共有${groups * per}人。`,
        hints: ["只有组数，不能知道总人数。", "总人数=组数×每组人数。"],
        steps: [`缺少“每组人数”。`, `补充每组${per}人后：${groups}×${per}=${total}人。`],
        extension: `如果补充“每组人数不一样”，还需要知道每一组分别有几人。`
      });
    }
  },
  {
    id: "review-time-remainder",
    chapterId: "review",
    level: "mixed",
    skill: "时间与余数综合",
    title: "按时间轮流",
    factory(template) {
      const start = randInt(8 * 60, 9 * 60);
      const per = choice([5, 6, 8, 10]);
      const children = randInt(4, 7);
      const target = randInt(children * 2 + 1, children * 5);
      const finish = start + target * per;
      const childIndex = ((target - 1) % children) + 1;
      return makeQuestion(template, {
        question: `${children}个小朋友轮流操作电脑，每人每次${per}分钟，从${digitalTime(start)}开始，第${target}次操作结束时是几点？第${target}次轮到第几个小朋友？`,
        answer: `结束时间是${formatTime(finish)}；第${target}次轮到第${childIndex}个小朋友。`,
        hints: ["结束时间用次数×每次时间。", "轮到谁用周期问题，周期是小朋友人数。"],
        steps: [
          `总时间=${target}×${per}=${target * per}分。`,
          `${digitalTime(start)}+${target * per}分=${digitalTime(finish)}。`,
          `${target}÷${children}=${Math.floor(target / children)}……${target % children}。`,
          target % children === 0 ? `没有余数，轮到第${children}个小朋友。` : `余数是${target % children}，轮到第${target % children}个小朋友。`
        ],
        extension: `第${target + children}次仍然轮到第${childIndex}个小朋友。`
      });
    }
  },
  {
    id: "review-number-shopping",
    chapterId: "review",
    level: "mixed",
    skill: "数位与加减法综合",
    title: "价格里的数字",
    factory(template) {
      const hundreds = randInt(2, 7);
      const tens = randInt(1, 8);
      const priceA = hundreds * 100 + tens * 10 + randInt(1, 9);
      const priceB = randInt(120, 360);
      const total = priceA + priceB;
      return makeQuestion(template, {
        question: `一个篮球的价格是${priceA}元，这个数的百位是几、十位是几？再买一副球拍${priceB}元，一共需要多少元？`,
        answer: `百位是${hundreds}，十位是${tens}；一共${total}元。`,
        hints: ["先看数位，再做加法。", "相同数位对齐相加。"],
        steps: [`${priceA}的百位是${hundreds}，十位是${tens}。`, `${priceA}+${priceB}=${total}元。`],
        extension: `如果篮球降价${tens * 10}元，新价格是${priceA - tens * 10}元。`
      });
    }
  },
  {
    id: "review-route-plan",
    chapterId: "review",
    level: "thinking",
    skill: "综合规划",
    title: "路线和时间",
    factory(template) {
      const walk1 = choice([8, 10, 12, 15]);
      const visit = choice([25, 30, 35, 40]);
      const walk2 = choice([6, 8, 10, 12]);
      const start = randInt(13 * 60 + 20, 14 * 60 + 10);
      const finish = start + walk1 + visit + walk2;
      return makeQuestion(template, {
        question: `${choice(names)}从家走到${choice(places)}要${walk1}分钟，参观${visit}分钟，再走${walk2}分钟到公交站。如果${digitalTime(start)}从家出发，到公交站是几点？如果公交车${digitalTime(finish - 5)}开走，他能赶上吗？`,
        answer: `到公交站是${formatTime(finish)}，赶不上。`,
        hints: ["把三段时间相加。", "到达时间晚于开车时间，就赶不上。"],
        steps: [`总用时=${walk1}+${visit}+${walk2}=${walk1 + visit + walk2}分。`, `${digitalTime(start)}+${walk1 + visit + walk2}分=${digitalTime(finish)}。`, `${digitalTime(finish)}晚于${digitalTime(finish - 5)}，所以赶不上。`],
        extension: `想赶上这班车，至少要提前5分钟出发，也就是${formatTime(start - 5)}出发。`
      });
    }
  },
  {
    id: "review-open-reason",
    chapterId: "review",
    level: "thinking",
    skill: "解释与验证",
    title: "谁说得有道理",
    factory(template) {
      const divisor = randInt(4, 8);
      const quotient = randInt(5, 10);
      const remainder = randInt(1, divisor - 1);
      const total = divisor * quotient + remainder;
      return makeQuestion(template, {
        question: `${total}个同学坐船，每条船坐${divisor}人。聪聪说需要${quotient}条船，明明说需要${quotient + 1}条船。谁说得有道理？请说明理由。`,
        answer: `明明说得有道理，需要${quotient + 1}条船。`,
        hints: ["先做有余数的除法。", "剩下的同学也需要坐船。"],
        steps: [`${total}÷${divisor}=${quotient}……${remainder}。`, `${quotient}条船坐满后还剩${remainder}人。`, `剩下的人也要一条船，所以需要${quotient + 1}条。`],
        extension: `如果只有${quotient}条船，最多能坐${quotient * divisor}人，还差${remainder}个座位。`
      });
    }
  },
  {
    id: "time-order-cards",
    chapterId: "time",
    level: "variant",
    skill: "时间排序",
    title: "彩色时间卡",
    factory(template) {
      const base = randInt(7 * 60 + 10, 8 * 60 + 20);
      const times = shuffle([base, base + 15, base + 35, base + 50]);
      const sorted = [...times].sort((a, b) => a - b);
      const cards = times.map((time, index) => ({ label: String.fromCharCode(65 + index), text: digitalTime(time) }));
      return makeQuestion(template, {
        question: `四张彩色时间卡分别是${times.map(digitalTime).join("、")}。请按从早到晚的顺序排列，并说说你先比较什么。`,
        answer: sorted.map(digitalTime).join(" < "),
        hints: ["先比小时，小时相同再比分。", "可以把时间卡从左到右摆一摆。"],
        steps: [`这些时间都可以先看小时。`, `小时相同时，再比较分钟。`, `从早到晚是${sorted.map(digitalTime).join("、")}。`],
        extension: `如果再加一张${digitalTime(base + 25)}的卡，它应排在${digitalTime(base + 15)}和${digitalTime(base + 35)}之间。`,
        visual: { type: "choice-board", label: "时间卡排序", cards }
      });
    }
  },
  {
    id: "time-route-choice",
    chapterId: "time",
    level: "thinking",
    skill: "路线时间比较",
    title: "选哪条路线",
    factory(template) {
      const red = randInt(18, 35);
      const blue = red + choice([-8, -5, 6, 9]);
      const green = red + choice([3, 7, 12]);
      const min = Math.min(red, blue, green);
      const answer = min === red ? "红色路线" : min === blue ? "蓝色路线" : "绿色路线";
      return makeQuestion(template, {
        question: `到科技馆有三条路线：红色路线${red}分钟，蓝色路线${blue}分钟，绿色路线${green}分钟。想最快到达，应选哪条路线？最慢的路线比最快的路线多用几分钟？`,
        answer: `应选${answer}。最慢比最快多${Math.max(red, blue, green) - min}分钟。`,
        hints: ["先找三条路线中最小的时间。", "再用最大时间减最小时间。"],
        steps: [`三条路线用时是${red}分、${blue}分、${green}分。`, `最快的是${min}分，所以选${answer}。`, `最慢比最快多${Math.max(red, blue, green)}-${min}=${Math.max(red, blue, green) - min}分。`],
        extension: `如果出发时间是8:20，走最快路线会在${formatTime(8 * 60 + 20 + min)}到达。`,
        visual: {
          type: "choice-board",
          label: "彩色路线",
          cards: [
            { label: "红", text: `${red}分` },
            { label: "蓝", text: `${blue}分` },
            { label: "绿", text: `${green}分` }
          ]
        }
      });
    }
  },
  {
    id: "time-missing-break",
    chapterId: "time",
    level: "thinking",
    skill: "时间反推",
    title: "中间休息多久",
    factory(template) {
      const start = randInt(18 * 60 + 10, 19 * 60);
      const first = choice([12, 15, 18, 20]);
      const second = choice([20, 25, 30]);
      const rest = choice([5, 8, 10, 12]);
      const finish = start + first + rest + second;
      return makeQuestion(template, {
        question: `${choice(names)}${digitalTime(start)}开始做两项任务：第一项${first}分钟，中间休息一会儿，第二项${second}分钟，${digitalTime(finish)}完成。中间休息了多少分钟？`,
        answer: `${rest}分钟。`,
        hints: ["先算从开始到完成一共过了多久。", "总时间减去两项任务时间，就是休息时间。"],
        steps: [`从${digitalTime(start)}到${digitalTime(finish)}共${finish - start}分钟。`, `两项任务共${first}+${second}=${first + second}分钟。`, `休息时间=${finish - start}-${first + second}=${rest}分钟。`],
        extension: `如果休息少2分钟，完成时间会提前到${formatTime(finish - 2)}。`,
        visual: { type: "timeline", label: "时间拼图", segments: [first, rest, second] }
      });
    }
  },
  {
    id: "remainder-picture-equation",
    chapterId: "remainder",
    level: "variant",
    skill: "看图列式",
    title: "看分组盒列式",
    factory(template) {
      const groupSize = randInt(4, 8);
      const groups = randInt(3, 7);
      const left = randInt(1, groupSize - 1);
      const total = groupSize * groups + left;
      return makeQuestion(template, {
        question: `图中每盒放${groupSize}张卡片，已经装满${groups}盒，还剩${left}张。请列出一个有余数的除法算式，并解释商和余数分别表示什么。`,
        answer: `${total}÷${groupSize}=${groups}……${left}。商${groups}表示装满${groups}盒，余数${left}表示还剩${left}张。`,
        hints: ["先求一共有多少张。", "每盒张数是除数，盒数是商。"],
        steps: [`总张数=${groupSize}×${groups}+${left}=${total}。`, `按每盒${groupSize}张分：${total}÷${groupSize}=${groups}……${left}。`],
        extension: `如果想再装满1盒，还需要${groupSize - left}张。`,
        visual: { type: "grouping", label: "看图列式", total, groupSize }
      });
    }
  },
  {
    id: "remainder-seat-grid",
    chapterId: "remainder",
    level: "thinking",
    skill: "座位推理",
    title: "座位够不够",
    factory(template) {
      const rows = randInt(3, 5);
      const cols = randInt(4, 7);
      const seats = rows * cols;
      const students = seats + randInt(1, cols - 1);
      return makeQuestion(template, {
        question: `礼堂先摆了${rows}排座位，每排${cols}个。现在有${students}人参加活动，这些座位够吗？如果不够，还至少要加几个座位？`,
        answer: `不够，还至少要加${students - seats}个座位。`,
        hints: ["先看图中一共有多少个座位。", "再和人数比较。"],
        steps: [`座位数=${rows}×${cols}=${seats}个。`, `${students}>${seats}，所以不够。`, `还差${students}-${seats}=${students - seats}个座位。`],
        extension: `如果再加1排${cols}个座位，就一共有${seats + cols}个座位，够坐。`,
        visual: { type: "ticket-grid", label: "座位图", rows, cols, filled: seats }
      });
    }
  },
  {
    id: "relations-array-picture",
    chapterId: "relations",
    level: "foundation",
    skill: "阵列看图",
    title: "看方阵说关系",
    factory(template) {
      const rows = randInt(3, 6);
      const cols = randInt(4, 8);
      const total = rows * cols;
      return makeQuestion(template, {
        question: `彩色方格图有${rows}行，每行${cols}个。请写出一个乘法算式和两个除法算式。`,
        answer: `${rows}×${cols}=${total}；${total}÷${rows}=${cols}；${total}÷${cols}=${rows}。`,
        hints: ["行数、每行个数、总数之间可以互相转换。", "乘法求总数，除法反推每行或行数。"],
        steps: [`先求总数：${rows}×${cols}=${total}。`, `总数÷行数=每行个数：${total}÷${rows}=${cols}。`, `总数÷每行个数=行数：${total}÷${cols}=${rows}。`],
        extension: `如果增加1行，总数会增加${cols}个。`,
        visual: { type: "ticket-grid", label: "彩色方阵", rows, cols, filled: total }
      });
    }
  },
  {
    id: "relations-choice-story",
    chapterId: "relations",
    level: "variant",
    skill: "选正确问题",
    title: "哪个问题能用除法",
    factory(template) {
      const total = randInt(36, 72);
      const groups = choice([4, 6, 8, 9]);
      const per = Math.floor(total / groups);
      const realTotal = per * groups;
      return makeQuestion(template, {
        question: `有${realTotal}张任务卡，平均放进${groups}个收纳格。下面哪个问题可以用${realTotal}÷${groups}解决？A.一共有几张卡？B.每格放几张？C.还要再买几张？D.哪种颜色最多？`,
        answer: `选B。${realTotal}÷${groups}求的是每格放几张。`,
        hints: ["除以格数，表示把总数平均分。", "看问题是不是在问每份有多少。"],
        steps: [`${realTotal}是总数，${groups}是份数。`, `总数÷份数=每份数。`, `所以${realTotal}÷${groups}解决的是“每格放几张”。`],
        extension: `如果问“一共有几张”，应该知道每格几张和格数后用乘法。`,
        visual: {
          type: "choice-board",
          label: "选择题卡",
          cards: [
            { label: "A", text: "总数" },
            { label: "B", text: "每份" },
            { label: "C", text: "增加" },
            { label: "D", text: "颜色" }
          ]
        }
      });
    }
  },
  {
    id: "numbers-abacus-read",
    chapterId: "numbers",
    level: "foundation",
    skill: "计数器读数",
    title: "彩色计数器",
    factory(template) {
      const digits = [randInt(1, 5), randInt(0, 6), randInt(0, 6), randInt(0, 6)];
      const number = digits[0] * 1000 + digits[1] * 100 + digits[2] * 10 + digits[3];
      return makeQuestion(template, {
        question: `看彩色计数器：千位${digits[0]}颗，百位${digits[1]}颗，十位${digits[2]}颗，个位${digits[3]}颗。这个数是多少？它由哪些计数单位组成？`,
        answer: `${number}，由${digits[0]}个千、${digits[1]}个百、${digits[2]}个十、${digits[3]}个一组成。`,
        hints: ["每一根杆代表一个数位。", "从千位到个位依次写数字。"],
        steps: [`千位是${digits[0]}，百位是${digits[1]}，十位是${digits[2]}，个位是${digits[3]}。`, `所以这个数是${number}。`],
        extension: `如果百位多1颗，这个数会变成${number + 100}。`,
        visual: { type: "abacus", label: "彩色计数器", digits }
      });
    }
  },
  {
    id: "numbers-numberline-estimate",
    chapterId: "numbers",
    level: "variant",
    skill: "数轴估计",
    title: "数轴上更接近谁",
    factory(template) {
      const start = choice([1000, 2000, 3000, 4000]);
      const end = start + 1000;
      const marker = start + randInt(120, 880);
      const closeTo = marker - start < end - marker ? start : end;
      return makeQuestion(template, {
        question: `数轴从${start}到${end}，标出的数是${marker}。它更接近${start}还是${end}？相差多少？`,
        answer: `更接近${closeTo}，相差${Math.abs(marker - closeTo)}。`,
        hints: ["分别算它离两端有多远。", "距离小的那一端就是更接近的数。"],
        steps: [`离${start}有${marker - start}。`, `离${end}有${end - marker}。`, `${Math.min(marker - start, end - marker)}更小，所以更接近${closeTo}。`],
        extension: `如果要估成整千数，可以估成${closeTo}。`,
        visual: { type: "number-line", label: "彩色数轴", start, end, marker }
      });
    }
  },
  {
    id: "numbers-condition-choice",
    chapterId: "numbers",
    level: "thinking",
    skill: "多条件筛选",
    title: "找符合条件的数",
    factory(template) {
      const target = randInt(3000, 8999);
      const thousands = Math.floor(target / 1000);
      const hundreds = Math.floor((target % 1000) / 100);
      const farOption = target + 1000 <= 9999 ? target + 1000 : target - 1000;
      const options = shuffle([target, target + 100, target - 10, farOption]);
      return makeQuestion(template, {
        question: `四张数字卡中，只有一个数符合：千位是${thousands}，百位是${hundreds}，并且比${target - 5}大。请选择这个数，并说明你排除了哪些。`,
        answer: `${target}。`,
        hints: ["先看千位，再看百位。", "最后检查是否比给出的数大。"],
        steps: [`目标数千位是${thousands}，百位是${hundreds}。`, `在${options.join("、")}中筛选。`, `符合所有条件的是${target}。`],
        extension: `如果条件改为“比${target + 5}小”，${target}仍然符合。`,
        visual: {
          type: "choice-board",
          label: "数字卡筛选",
          cards: options.map((value, index) => ({ label: String.fromCharCode(65 + index), text: value }))
        }
      });
    }
  },
  {
    id: "addsub-route-distance",
    chapterId: "addsub",
    level: "variant",
    skill: "路线距离",
    title: "两条路线差多少",
    factory(template) {
      const red = randInt(320, 680);
      const blue = red + choice([-90, -60, 70, 110]);
      const diff = Math.abs(red - blue);
      const shorter = red < blue ? "红色路线" : "蓝色路线";
      return makeQuestion(template, {
        question: `公园里有两条路线：红色路线${red}米，蓝色路线${blue}米。哪条路线更短？两条路线相差多少米？`,
        answer: `${shorter}更短，相差${diff}米。`,
        hints: ["先比较两个长度。", "再用大数减小数。"],
        steps: [`比较${red}和${blue}，较小的是${Math.min(red, blue)}。`, `相差${Math.max(red, blue)}-${Math.min(red, blue)}=${diff}米。`],
        extension: `如果走两条路线各一次，一共走${red + blue}米。`,
        visual: {
          type: "choice-board",
          label: "路线比较",
          cards: [
            { label: "红", text: `${red}米` },
            { label: "蓝", text: `${blue}米` }
          ]
        }
      });
    }
  },
  {
    id: "addsub-receipt-error",
    chapterId: "addsub",
    level: "thinking",
    skill: "小票纠错",
    title: "找出小票错误",
    factory(template) {
      const a = randInt(180, 360);
      const b = randInt(120, 260);
      const correct = a + b;
      const shown = correct + choice([-20, -10, 10, 30]);
      return makeQuestion(template, {
        question: `彩色小票上写着：红色商品${a}元，蓝色商品${b}元，合计${shown}元。这个合计对吗？如果不对，正确合计是多少？`,
        answer: `不对，正确合计是${correct}元。`,
        hints: ["重新把两个价格相加。", "比较你算出的合计和小票上的合计。"],
        steps: [`${a}+${b}=${correct}元。`, `${correct}≠${shown}，所以小票合计不对。`],
        extension: `小票上的数比正确合计${shown > correct ? "多" : "少"}${Math.abs(shown - correct)}元。`,
        visual: {
          type: "shopping",
          label: "小票纠错",
          prices: [a, b, shown],
          items: [
            { name: "红色商品", color: "红", price: a },
            { name: "蓝色商品", color: "蓝", price: b },
            { name: "小票合计", color: "黄", price: shown }
          ]
        }
      });
    }
  },
  {
    id: "addsub-estimate-line",
    chapterId: "addsub",
    level: "thinking",
    skill: "估算判断",
    title: "先估后算",
    factory(template) {
      const a = randInt(380, 760);
      const b = randInt(140, 330);
      const exact = a - b;
      const estimate = Math.round(exact / 100) * 100;
      return makeQuestion(template, {
        question: `计算${a}-${b}前，先估一估结果大约是多少。再准确计算，并判断估算是否合理。`,
        answer: `准确结果是${exact}，大约是${estimate}，估算合理。`,
        hints: ["可以把数看成接近的整百数。", "估算后还要准确计算验证。"],
        steps: [`准确计算：${a}-${b}=${exact}。`, `${exact}接近${estimate}，所以可以估成${estimate}左右。`],
        extension: `如果${a}增加100，差会增加100，变成${exact + 100}。`,
        visual: { type: "number-line", label: "估算数轴", start: Math.max(0, estimate - 300), end: estimate + 300, marker: exact }
      });
    }
  },
  {
    id: "comics-four-frame",
    chapterId: "comics",
    level: "variant",
    skill: "分镜读图",
    title: "四格任务图",
    factory(template) {
      const start = randInt(20, 45);
      const add = randInt(8, 20);
      const give = randInt(5, 18);
      const left = start + add - give;
      return makeQuestion(template, {
        question: `四格图：图1有${start}张卡片，图2又加入${add}张，图3送给同学${give}张，图4要求还剩多少张。请按图的顺序列式。`,
        answer: `${start}+${add}-${give}=${left}，还剩${left}张。`,
        hints: ["按图1到图4的顺序读信息。", "先增加，再减少。"],
        steps: [`图1到图2：${start}+${add}=${start + add}。`, `图3送出${give}张：${start + add}-${give}=${left}。`],
        extension: `如果图3送出的人数少2张，就会还剩${left + 2}张。`,
        visual: { type: "story", label: "四格图", values: [start, add, give, left] }
      });
    }
  },
  {
    id: "comics-choose-question",
    chapterId: "comics",
    level: "thinking",
    skill: "提出问题",
    title: "哪一个是两步问题",
    factory(template) {
      const morning = randInt(18, 36);
      const afternoon = randInt(12, 28);
      const used = randInt(8, 20);
      return makeQuestion(template, {
        question: `图中信息：上午收集${morning}张卡片，下午收集${afternoon}张，做展示板用了${used}张。下面哪个问题需要两步计算？A.上午收集多少张？B.全天收集多少张？C.做完展示板还剩多少张？D.下午比上午少多少张？`,
        answer: `选C。要先算全天收集多少张，再减去用掉的。`,
        hints: ["两步问题通常要先得到一个中间结果。", "看哪个问题既要合起来，又要减掉。"],
        steps: [`全天收集：${morning}+${afternoon}=${morning + afternoon}张。`, `还剩：${morning + afternoon}-${used}=${morning + afternoon - used}张。`, `所以C是两步问题。`],
        extension: `B只需要一步加法，D只需要一步减法。`,
        visual: {
          type: "choice-board",
          label: "问题选择",
          cards: [
            { label: "A", text: "上午" },
            { label: "B", text: "全天" },
            { label: "C", text: "剩下" },
            { label: "D", text: "相差" }
          ]
        }
      });
    }
  },
  {
    id: "review-color-fair",
    chapterId: "review",
    level: "mixed",
    skill: "综合任务",
    title: "彩色游园会",
    factory(template) {
      const start = randInt(9 * 60, 10 * 60);
      const games = randInt(4, 7);
      const per = choice([6, 8, 10]);
      const tickets = games * per + randInt(1, per - 1);
      const finish = start + games * per;
      return makeQuestion(template, {
        question: `游园会从${digitalTime(start)}开始，每个游戏体验${per}分钟。小云体验了${games}个游戏后，还剩${tickets}张彩色券。她体验完这些游戏是几点？这些彩色券如果每${per}张装一袋，可以装满几袋，还剩几张？`,
        answer: `体验完是${formatTime(finish)}；彩色券可以装满${Math.floor(tickets / per)}袋，还剩${tickets % per}张。`,
        hints: ["先解决时间问题，再解决有余数除法。", "一个题里可能有两个不同的数学模型。"],
        steps: [`时间：${games}×${per}=${games * per}分，${digitalTime(start)}+${games * per}分=${digitalTime(finish)}。`, `分券：${tickets}÷${per}=${Math.floor(tickets / per)}……${tickets % per}。`],
        extension: `如果再得到${per - (tickets % per)}张券，就能多装满1袋。`,
        visual: { type: "timeline", label: "综合任务线", segments: [per, per, per, per] }
      });
    }
  },
  {
    id: "review-number-ticket",
    chapterId: "review",
    level: "thinking",
    skill: "数位与运算",
    title: "门票编号",
    factory(template) {
      const thousands = randInt(2, 8);
      const hundreds = randInt(1, 9);
      const tens = randInt(0, 9);
      const ones = randInt(0, 9);
      const number = thousands * 1000 + hundreds * 100 + tens * 10 + ones;
      const add = choice([100, 200, 300]);
      return makeQuestion(template, {
        question: `门票编号是${number}。它的百位数字是多少？如果下一组门票编号比它大${add}，下一组编号是多少？`,
        answer: `百位数字是${hundreds}；下一组编号是${number + add}。`,
        hints: ["先看数位。", "增加几百，只改变百位附近的数。"],
        steps: [`${number}的百位是${hundreds}。`, `${number}+${add}=${number + add}。`],
        extension: `如果编号减少100，会变成${number - 100}。`,
        visual: { type: "place-value", label: "门票编号", number, digits: [thousands, hundreds, tens, ones] }
      });
    }
  },
  {
    id: "review-logic-choice",
    chapterId: "review",
    level: "thinking",
    skill: "判断与说明",
    title: "谁的说法对",
    factory(template) {
      const total = randInt(45, 78);
      const per = randInt(5, 9);
      const q = Math.floor(total / per);
      const r = total % per || 2;
      const adjustedTotal = q * per + r;
      return makeQuestion(template, {
        question: `${adjustedTotal}张任务卡，每${per}张放一袋。A说能正好装${q}袋，B说装满${q}袋后还剩${r}张，C说至少需要${q}袋。谁的说法正确？`,
        answer: `B正确。${adjustedTotal}÷${per}=${q}……${r}，至少需要${q + 1}袋。`,
        hints: ["先算有余数的除法。", "注意“装满几袋”和“至少需要几袋”不是同一个问题。"],
        steps: [`${adjustedTotal}÷${per}=${q}……${r}。`, `能装满${q}袋，还剩${r}张，所以B正确。`, `如果问至少需要几袋，应是${q + 1}袋。`],
        extension: `A错在忽略了余数，C错在没有给剩下的卡片准备袋子。`,
        visual: {
          type: "choice-board",
          label: "说法判断",
          cards: [
            { label: "A", text: "正好" },
            { label: "B", text: "有剩" },
            { label: "C", text: "至少" }
          ]
        }
      });
    }
  }
];

export function templatesForChapter(chapterId) {
  return templates.filter((template) => template.chapterId === chapterId);
}

export function generateFromTemplate(templateId) {
  const template = templates.find((item) => item.id === templateId);
  if (!template) return null;
  return template.factory(template);
}

export function generatePractice({ chapterId = "all", level = "thinking", count = 8 } = {}) {
  const normalizedCount = Number(count) || 8;
  let pool = templates;

  if (chapterId !== "all") {
    pool = pool.filter((template) => template.chapterId === chapterId);
  }

  if (level !== "mixed") {
    pool = pool.filter((template) => template.level === level);
  }

  if (pool.length === 0 && chapterId !== "all") {
    pool = templates.filter((template) => template.chapterId === chapterId);
  }

  if (pool.length === 0) {
    pool = templates;
  }

  const ordered = shuffle(pool);
  return Array.from({ length: normalizedCount }, (_, index) => {
    const template = ordered[index % ordered.length];
    return template.factory(template);
  });
}

export function chapterTemplateSummary() {
  return chapters.map((chapter) => {
    const chapterTemplates = templatesForChapter(chapter.id);
    return {
      ...chapter,
      totalTemplates: chapterTemplates.length,
      skills: [...new Set(chapterTemplates.map((template) => template.skill))]
    };
  });
}
