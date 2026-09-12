const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}


// ==========================
// EARNORA DEMO DATA
// ==========================

const state = JSON.parse(
  localStorage.getItem("earnora_demo") ||
  '{"balance":0,"tasksDone":0,"referrals":0,"refEarned":0,"checkedIn":false,"claimed":[]}'
);


// ==========================
// HELPER FUNCTIONS
// ==========================

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => [
  ...document.querySelectorAll(selector)
];


function save() {
  localStorage.setItem(
    "earnora_demo",
    JSON.stringify(state)
  );

  render();
}


function formatNumber(number) {
  return number.toLocaleString("en-US");
}


function showToast(message) {

  const toast = $("#toast");

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}


// ==========================
// SCREEN NAVIGATION
// ==========================

function openScreen(screenName) {

  $$(".screen").forEach((screen) => {

    screen.classList.toggle(
      "active",
      screen.id === screenName
    );

  });


  $$(".nav-item").forEach((item) => {

    item.classList.toggle(
      "active",
      item.dataset.screen === screenName
    );

  });


  window.scrollTo(0, 0);
}


$$("[data-screen]").forEach((button) => {

  button.addEventListener("click", () => {

    openScreen(
      button.dataset.screen
    );

  });

});


// ==========================
// RENDER USER INFORMATION
// ==========================

function render() {

  $("#balance").textContent =
    formatNumber(state.balance);


  $("#profileBalance").textContent =
    formatNumber(state.balance);


  $("#tasksDone").textContent =
    state.tasksDone;


  $("#profileRefs").textContent =
    state.referrals;


  $("#refCount").textContent =
    state.referrals;


  $("#refEarned").textContent =
    formatNumber(state.refEarned);


  if (state.checkedIn) {

    $("#checkinStatus").textContent =
      "Daily reward claimed. Come back tomorrow.";

  } else {

    $("#checkinStatus").textContent =
      "Claim your daily reward.";

  }


  // Telegram user information

  const user =
    tg?.initDataUnsafe?.user;


  if (user) {

    const name =
      [
        user.first_name,
        user.last_name
      ]
      .filter(Boolean)
      .join(" ") ||
      "Earnora User";


    const initial =
      (
        user.first_name ||
        "E"
      )
      .charAt(0)
      .toUpperCase();


    $("#profileName").textContent =
      name;


    $("#profileUsername").textContent =
      user.username
        ? "@" + user.username
        : "Telegram user";


    $("#avatar").textContent =
      initial;


    $("#profileAvatar").textContent =
      initial;

  }


  // Update claimed tasks

  $$(".task-btn").forEach((button) => {

    const reward =
      Number(button.dataset.reward);


    if (
      state.claimed.includes(reward)
    ) {

      button.textContent =
        "Claimed";

      button.classList.add("done");

    }

  });

}


// ==========================
// DAILY CHECK-IN
// ==========================

$("#checkinBtn").addEventListener(
  "click",
  () => {

    if (state.checkedIn) {

      showToast(
        "Daily reward already claimed"
      );

      return;

    }


    state.balance += 50;

    state.checkedIn = true;

    save();


    showToast(
      "+50 points added!"
    );

  }
);


// ==========================
// TASK CLAIMING
// ==========================

$$(".task-btn").forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      const reward =
        Number(button.dataset.reward);


      if (
        state.claimed.includes(reward)
      ) {

        showToast(
          "Task already claimed"
        );

        return;

      }


      state.claimed.push(reward);

      state.balance += reward;

      state.tasksDone += 1;

      save();


      showToast(
        `+${formatNumber(reward)} points added!`
      );

    }
  );

});


// ==========================
// REFERRAL LINK
// ==========================

$("#copyBtn").addEventListener(
  "click",
  async () => {

    const link =
      $("#refLink").textContent;


    try {

      await navigator.clipboard.writeText(
        link
      );

      showToast(
        "Referral link copied"
      );

    } catch {

      showToast(
        "Copy not available"
      );

    }

  }
);


// ==========================
// SHARE REFERRAL LINK
// ==========================

$("#shareBtn").addEventListener(
  "click",
  () => {

    const link =
      $("#refLink").textContent;


    const message =
      "Join me on Earnora and earn rewards!";


    const telegramShare =
      `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(message)}`;


    if (tg) {

      tg.openTelegramLink(
        telegramShare
      );

    } else {

      window.open(
        telegramShare,
        "_blank"
      );

    }

  }
);


// ==========================
// REWARDS
// ==========================

$$(".reward-btn").forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      const cost =
        Number(button.dataset.cost);


      if (
        state.balance < cost
      ) {

        showToast(
          "Not enough points"
        );

        return;

      }


      state.balance -= cost;

      save();


      showToast(
        "Reward request submitted"
      );

    }
  );

});


// ==========================
// WITHDRAW
// ==========================

$("#withdrawBtn").addEventListener(
  "click",
  () => {

    showToast(
      "Withdrawals will be enabled later"
    );

  }
);


// ==========================
// START APP
// ==========================

render();
