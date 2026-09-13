const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const APP_NAME = "Xevani";

const DAILY_REWARD = 100;
const REFERRAL_REWARD = 500;
const MIN_WITHDRAWAL = 50000;

const STORAGE_KEY = "xevani_demo";

const user = tg?.initDataUnsafe?.user || null;


/* =========================
   TASKS
========================= */

const TASKS = {
  telegram: {
    id: "task_telegram",
    name: "Join our Telegram channel",
    reward: 500,
    type: "telegram_join",
    verification: "telegram_membership"
  },

  website: {
    id: "task_website",
    name: "Visit our website",
    reward: 250,
    type: "website_visit",
    verification: "backend"
  },

  video: {
    id: "task_video",
    name: "Watch a short video",
    reward: 150,
    type: "video_watch",
    verification: "video_completion"
  },

  updates: {
    id: "task_updates",
    name: "Follow our updates",
    reward: 300,
    type: "social_follow",
    verification: "backend"
  }
};


/* =========================
   STATE
========================= */

const defaultState = {
  balance: 0,
  tasksDone: 0,
  referrals: 0,
  refEarned: 0,
  streak: 0,
  lastCheckin: null,

  /*
    Tasks that have actually been verified
    by the backend.
  */
  verifiedTasks: [],

  /*
    Tasks currently waiting for verification.
  */
  pendingTasks: [],

  watchedAds: 0
};


let state = loadState();


function loadState() {

  try {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return { ...defaultState };
    }

    const parsed = JSON.parse(saved);

    return {
      ...defaultState,
      ...parsed,
      verifiedTasks: parsed.verifiedTasks || [],
      pendingTasks: parsed.pendingTasks || []
    };

  } catch (error) {

    console.error("Could not load Xevani state:", error);

    return { ...defaultState };
  }
}


function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );
}


/* =========================
   HELPERS
========================= */

function $(id) {
  return document.getElementById(id);
}


function showToast(message) {

  const toast = $("toast");

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


function getToday() {

  const date = new Date();

  return date.toISOString().split("T")[0];
}


function getYesterday() {

  const date = new Date();

  date.setDate(date.getDate() - 1);

  return date.toISOString().split("T")[0];
}


/* =========================
   USER INFORMATION
========================= */

function renderUser() {

  const firstName = user?.first_name || "User";

  const fullName = [
    user?.first_name,
    user?.last_name
  ]
    .filter(Boolean)
    .join(" ") || "Xevani User";


  const username = user?.username
    ? `@${user.username}`
    : "Telegram user";


  const initial =
    (user?.first_name || "X").charAt(0).toUpperCase();


  if ($("welcomeName")) {
    $("welcomeName").textContent = firstName;
  }


  if ($("avatar")) {
    $("avatar").textContent = initial;
  }


  if ($("profileAvatar")) {
    $("profileAvatar").textContent = initial;
  }


  if ($("profileName")) {
    $("profileName").textContent = fullName;
  }


  if ($("profileUsername")) {
    $("profileUsername").textContent = username;
  }
}


/* =========================
   SCREEN NAVIGATION
========================= */

function openScreen(screenId) {

  document
    .querySelectorAll(".screen")
    .forEach(screen => {

      screen.classList.toggle(
        "active",
        screen.id === screenId
      );

    });


  document
    .querySelectorAll(".nav-item")
    .forEach(item => {

      item.classList.toggle(
        "active",
        item.dataset.screen === screenId
      );

    });

}


document.addEventListener("click", event => {

  const button = event.target.closest("[data-screen]");

  if (!button) return;

  const screen = button.dataset.screen;

  if (!screen) return;

  openScreen(screen);

});


/* =========================
   RENDER BALANCE
========================= */

function renderBalance() {

  const balance = state.balance.toLocaleString();

  if ($("balance")) {
    $("balance").textContent = balance;
  }


  if ($("rewardBalance")) {
    $("rewardBalance").textContent = balance;
  }


  if ($("profileBalance")) {
    $("profileBalance").textContent = balance;
  }
}


/* =========================
   RENDER STATS
========================= */

function renderStats() {

  if ($("tasksDone")) {
    $("tasksDone").textContent = state.tasksDone;
  }


  if ($("profileTasks")) {
    $("profileTasks").textContent = state.tasksDone;
  }


  if ($("streakCount")) {
    $("streakCount").textContent = state.streak;
  }


  if ($("profileStreak")) {
    $("profileStreak").textContent =
      `${state.streak} ${state.streak === 1 ? "day" : "days"}`;
  }


  if ($("refCountHome")) {
    $("refCountHome").textContent = state.referrals;
  }


  if ($("refCount")) {
    $("refCount").textContent = state.referrals;
  }


  if ($("profileRefs")) {
    $("profileRefs").textContent = state.referrals;
  }


  if ($("refEarned")) {
    $("refEarned").textContent =
      state.refEarned.toLocaleString();
  }
}


/* =========================
   DAILY CHECK-IN
========================= */

function renderCheckin() {

  const today = getToday();

  const claimedToday =
    state.lastCheckin === today;


  const button = $("checkinBtn");
  const status = $("checkinStatus");


  if (claimedToday) {

    if (button) {
      button.textContent = "Claimed";
      button.disabled = true;
    }

    if (status) {
      status.textContent = "Today's reward has been claimed.";
    }

    return;
  }


  if (button) {
    button.textContent = "Claim";
    button.disabled = false;
  }


  if (status) {
    status.textContent = "Claim your daily reward.";
  }
}


function claimDailyReward() {

  const today = getToday();

  if (state.lastCheckin === today) {
    showToast("Daily reward already claimed.");
    return;
  }


  const yesterday = getYesterday();


  if (state.lastCheckin === yesterday) {
    state.streak += 1;
  } else {
    state.streak = 1;
  }


  state.lastCheckin = today;

  state.balance += DAILY_REWARD;

  saveState();

  renderAll();

  showToast(`+${DAILY_REWARD} points added!`);
}


$("checkinBtn")?.addEventListener(
  "click",
  claimDailyReward
);


/* =========================
   TASK VERIFICATION
========================= */

/*
  IMPORTANT:

  This function deliberately DOES NOT award points.

  In production, this request will go to the Xevani
  backend.

  The backend will verify the user's action and return
  something similar to:

  {
    verified: true,
    reward: 500
  }

  Only then will completeVerifiedTask() be called.
*/


async function verifyTask(task) {

  /*
    BACKEND PLACEHOLDER

    Example production request:

    const response = await fetch(
      "https://api.xevani.com/tasks/verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          taskId: task.id,
          telegramUserId: user?.id,
          initData: tg?.initData
        })
      }
    );

    return await response.json();
  */


  console.log(
    "Verification required for:",
    task.id
  );


  /*
    We don't pretend verification succeeded.

    This prevents the frontend from giving users
    free points before the real backend exists.
  */

  return {
    verified: false,
    message: "Verification service is not connected yet."
  };
}


/* =========================
   START TASK
========================= */

async function startTask(button) {

  const taskKey = button.dataset.task;

  const task = TASKS[taskKey];

  if (!task) {
    showToast("Task could not be found.");
    return;
  }


  if (state.verifiedTasks.includes(task.id)) {

    showToast("You have already completed this task.");

    return;
  }


  if (state.pendingTasks.includes(task.id)) {

    showToast("This task is already waiting for verification.");

    return;
  }


  state.pendingTasks.push(task.id);

  saveState();

  button.disabled = true;

  button.textContent = "Verifying...";


  const result = await verifyTask(task);


  /*
    Verification failed or is not connected.
  */

  if (!result?.verified) {

    state.pendingTasks =
      state.pendingTasks.filter(
        id => id !== task.id
      );

    saveState();

    button.disabled = false;

    button.textContent = "Start";

    showToast(
      result?.message ||
      "Task could not be verified."
    );

    return;
  }


  /*
    ONLY verified tasks reach this point.
  */

  completeVerifiedTask(
    task,
    result.reward || task.reward
  );
}


/* =========================
   COMPLETE VERIFIED TASK
========================= */

function completeVerifiedTask(task, reward) {

  state.pendingTasks =
    state.pendingTasks.filter(
      id => id !== task.id
    );


  if (state.verifiedTasks.includes(task.id)) {
    return;
  }


  state.verifiedTasks.push(task.id);

  state.tasksDone += 1;

  state.balance += Number(reward);


  saveState();

  renderAll();

  showToast(`Verified! +${reward} points`);
}


/* =========================
   TASK BUTTONS
========================= */

document.addEventListener("click", event => {

  const button =
    event.target.closest(".task-btn");

  if (!button) return;

  startTask(button);

});


/* =========================
   TASK BUTTON STATUS
========================= */

function renderTaskButtons() {

  document
    .querySelectorAll(".task-btn")
    .forEach(button => {

      const taskKey = button.dataset.task;

      const task = TASKS[taskKey];

      if (!task) return;


      if (state.verifiedTasks.includes(task.id)) {

        button.textContent = "Completed";
        button.disabled = true;

        return;
      }


      if (state.pendingTasks.includes(task.id)) {

        button.textContent = "Verifying...";
        button.disabled = true;

        return;
      }


      button.textContent = "Start";
      button.disabled = false;

    });
}


/* =========================
   WATCH ADS
========================= */

$("watchAdBtn")?.addEventListener(
  "click",
  () => {

    showToast(
      "Sponsored ads will be connected to verification."
    );

  }
);


/* =========================
   FILTERS
========================= */

document
  .querySelectorAll(".filter")
  .forEach(filter => {

    filter.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".filter")
          .forEach(item =>
            item.classList.remove("active")
          );


        filter.classList.add("active");


        const category =
          filter.textContent.trim().toLowerCase();


        document
          .querySelectorAll(".task-large")
          .forEach(taskCard => {

            if (category === "all") {

              taskCard.style.display = "";

              return;
            }


            const description =
              taskCard
                .querySelector(".task-copy span")
                ?.textContent
                .toLowerCase() || "";


            taskCard.style.display =
              description.includes(category)
                ? ""
                : "none";

          });

      }
    );

  });


/* =========================
   REFERRAL LINK
========================= */

function getReferralLink() {

  const botUsername =
    "XevaniBot";


  if (!user?.id) {

    return `https://t.me/${botUsername}?start=demo`;

  }


  return `https://t.me/${botUsername}?start=ref_${user.id}`;
}


function renderReferralLink() {

  const link = $("refLink");

  if (!link) return;

  link.textContent = getReferralLink();
}


$("copyBtn")?.addEventListener(
  "click",
  async () => {

    const link = getReferralLink();


    try {

      await navigator.clipboard.writeText(link);

      showToast("Referral link copied!");

    } catch {

      showToast("Could not copy the link.");

    }

  }
);


$("shareBtn")?.addEventListener(
  "click",
  () => {

    const link = getReferralLink();


    const message =
      `Join ${APP_NAME} and earn points by completing tasks. ${link}`;


    if (tg?.openTelegramLink) {

      const shareUrl =
        `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(message)}`;

      tg.openTelegramLink(shareUrl);

      return;
    }


    if (navigator.share) {

      navigator.share({
        title: APP_NAME,
        text: message,
        url: link
      });

      return;
    }


    showToast("Sharing is not available.");
  }
);


/* =========================
   WITHDRAWAL
========================= */

function requestWithdrawal() {

  if (state.balance < MIN_WITHDRAWAL) {

    const remaining =
      MIN_WITHDRAWAL - state.balance;


    showToast(
      `You need ${remaining.toLocaleString()} more points.`
    );

    return;
  }


  /*
    IMPORTANT:

    We do NOT remove the user's balance here.

    A real withdrawal request must be created
    and processed by the backend.
  */

  showToast(
    "Withdrawal service will be connected to Xevani."
  );
}


$("withdrawHomeBtn")?.addEventListener(
  "click",
  requestWithdrawal
);


$("withdrawBtn")?.addEventListener(
  "click",
  requestWithdrawal
);


$("profileWithdrawBtn")?.addEventListener(
  "click",
  requestWithdrawal
);


/* =========================
   REWARD BUTTONS
========================= */

document
  .querySelectorAll(".reward-btn")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const cost =
          Number(button.dataset.cost);


        if (cost < MIN_WITHDRAWAL) {

          showToast(
            `Minimum withdrawal is ${MIN_WITHDRAWAL.toLocaleString()} points.`
          );

          return;
        }


        if (state.balance < cost) {

          showToast("Not enough points.");

          return;
        }


        requestWithdrawal();

      }
    );

  });


/* =========================
   PROFILE EARN BUTTON
========================= */

$("profileEarnBtn")?.addEventListener(
  "click",
  () => openScreen("tasks")
);


/* =========================
   RENDER EVERYTHING
========================= */

function renderAll() {

  renderUser();

  renderBalance();

  renderStats();

  renderCheckin();

  renderTaskButtons();

  renderReferralLink();
}


/* =========================
   START APP
========================= */

renderAll();
