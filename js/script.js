const baseURL = "https://rlss-stats-tracker-backend.onrender.com";
// const baseURL = "http://localhost:5000";

$(document).ready(function () {
  $("#navbar > .item").tab();

  var leaderboard, allUserInfo;

  fetch(`${baseURL}/leaderboard`, { method: "GET" })
    .then(response => {
      if (response.ok) return response.json();
      else return Promise.reject(response);
    }).then(data => {
      leaderboard = data;

      var options;

      for (const [key, value] of Object.entries(data)) {
        options += `<option value="${key}">${value.categoryName}</option>`;
      }

      $("#leaderboard-select").append(options);
      $("#leaderboard-select").removeClass("disabled");
      $("#leaderboard-select").dropdown();
      $("#leaderboard-form").removeClass("loading");
    }).catch(err => {
      console.log(err)
      err.json()
        .then(data => {
          console.log(data);
        });
    });

  fetch(`${baseURL}/user-info`, { method: "GET" })
    .then(response => {
      if (response.ok) return response.json();
      else return Promise.reject(response);
    }).then(data => {
      allUserInfo = data;

      var options;

      data.forEach(user => options += `<option value="${user.name}">${user.name}</option>`);

      $("#player-select").append(options);
      $("#player-select").removeClass("disabled");
      $("#player-select").dropdown();
      $("#player-form").removeClass("loading");
    }).catch(err => {
      err.json()
        .then(data => {
          console.log(data);
        });
    });

  $(document).on("change", "#leaderboard-select", function (e) {
    $("#leaderboard-form").addClass("loading");
    // $("#leaderboard-select").addClass("disabled");
    $("#leaderboard-content").empty();

    const category = $("#leaderboard-select").dropdown("get value");
    const categoryInfo = leaderboard[category];

    var leaderboardContent = `
      <h2 class="ui header">${categoryInfo.leaderboardName}</h2>
      <table id="leaderboard-table" class="ui unstackable table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>${categoryInfo.categoryName}</th>
          </tr>
        </thead>
        <tbody>
    `;

    categoryInfo.leaderboard.forEach((user, index) => {
      leaderboardContent += `
          <tr>
            <td data-order="${index+1}">
              <div class="ui ${
                (index+1 === 1) ? "gold"
                : (index+1 === 2) ? "silver"
                : (index+1 === 3) ? "bronze"
                : ""
              } label">
                ${(index+1 === 1 || index+1 === 2 || index+1 === 3) ? "<i class=\"trophy icon\"></i>" : ""}
                ${index+1}
              </div>
            </td>
            <td>${user.username}</td>
            <td>${user.stat}</td>
          </tr>
      `;
    });

    leaderboardContent += `
        </tbody>
      </table>
    `;

    $("#leaderboard-content").append(leaderboardContent);
    $("#leaderboard-table").DataTable({
      "autoWidth": false
    });

    // $("#leaderboard-select").removeClass("disabled");
    $("#leaderboard-form").removeClass("loading");
  });

  $(document).on("change", "#player-select", function (e) {
    $("#player-form").addClass("loading");
    // $("#player-select").addClass("disabled");
    $("#player-content").empty();

    const user = $("#player-select").dropdown("get value");
    const userInfo = allUserInfo.find(info => info.name === user);

    var playerContent = `
      <h2 class="ui header">${user}'s Overall Stats</h2>
      <div class="ui cards">
        <div class="card">
          <div class="content">
            <div class="header">${userInfo.matchesPlayed}</div>
            <div class="meta">matches played</div>
          </div>
        </div>
        <div class="card">
          <div class="content">
            <div class="header">${userInfo.matchesWon}</div>
            <div class="meta">matches won</div>
          </div>
        </div>
        <div class="card">
          <div class="content">
            <div class="header">${userInfo.winPercentage}%</div>
            <div class="meta">win percentage</div>
          </div>
        </div>
        <div class="card">
          <div class="content">
            <div class="header">${userInfo.goalsScored}</div>
            <div class="meta">goals scored</div>
          </div>
        </div>
        <div class="card">
          <div class="content">
            <div class="header">${userInfo.goalsConceded}</div>
            <div class="meta">goals conceded</div>
          </div>
        </div>
        <div class="card">
          <div class="content">
            <div class="header">${userInfo.averageGoals}</div>
            <div class="meta">average goals per match</div>
          </div>
        </div>
      </div>

      <h2 class="ui header">${user}'s Match History</h2>
      <table id="player-table" class="ui unstackable table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Season</th>
            <th>Opponent</th>
            <th>Scored</th>
            <th>Conceded</th>
            <th>Goal Difference</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
    `;

    userInfo.matchHistory.forEach(match => {
      playerContent += `
          <tr>
            <td data-order="${match.date.seconds}">
              ${(new Date(match.date.seconds * 1000)).toDateString()}
            </td>
            <td>${match.season}</td>
            <td>${(match.winner === user) ? match.loser : match.winner}</td>
            <td>${(match.winner === user) ? match.score[0] : match.score[1]}</td>
            <td>${(match.winner === user) ? match.score[1] : match.score[0]}</td>
            <td>${(match.winner === user) ? 
              match.score[0] - match.score[1] : 
              match.score[1] - match.score[0]}</td>
            ${
              (match.winner === user) ?
              `<td data-order=1>
                <div class="ui green label">
                  <i class="trophy icon"></i>
                  Win
                </div>
              </td>`
              :
              `<td data-order=0>
                <div class="ui red label">
                  <i class="skull crossbones icon"></i>
                  Loss
                </div>
              </td>`
            }
          </tr>
      `;
    });

    playerContent += `
        </tbody>
      </table>
    `;

    $("#player-content").append(playerContent);
    $("#player-table").DataTable({
      "autoWidth": false
    });

    // $("#player-select").removeClass("disabled");
    $("#player-form").removeClass("loading");
  });
});