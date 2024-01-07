const baseURL = "https://rlss-stats-tracker-backend.vercel.app/";
// const baseURL = "http://localhost:5000";

$(document).ready(function () {
  $(document).on("change", "#player-select", function (e) {
    $("#player-form-button").removeClass("disabled");
  })

  $(document).on("click", "#player-form-button", function (e) {
    $("#player-form").addClass("loading");
    // $("#player-select").addClass("disabled");
    $("#player-content").empty();

    const user = $("#player-select").dropdown("get value");
    fetch(`${baseURL}/user?user=${user}`, { method: "GET" })
      .then(response => {
        if (response.ok) return response.json();
        else return Promise.reject(response);
      }).then(data => {
        var playerContent = `
          <h2 class="ui header">${user}'s Overall Stats</h2>
          <div class="ui cards">
            <div class="card">
              <div class="content">
                <div class="header">${data.matchesPlayed}</div>
                <div class="meta">matches played</div>
              </div>
            </div>
            <div class="card">
              <div class="content">
                <div class="header">${data.matchesWon}</div>
                <div class="meta">matches won</div>
              </div>
            </div>
            <div class="card">
              <div class="content">
                <div class="header">${data.winPercentage}%</div>
                <div class="meta">win percentage</div>
              </div>
            </div>
            <div class="card">
              <div class="content">
                <div class="header">${data.goalsScored}</div>
                <div class="meta">goals scored</div>
              </div>
            </div>
            <div class="card">
              <div class="content">
                <div class="header">${data.goalsConceded}</div>
                <div class="meta">goals conceded</div>
              </div>
            </div>
            <div class="card">
              <div class="content">
                <div class="header">${data.averageGoals}</div>
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

        data.matchHistory.forEach(match => {
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
                <td>${(match.winner === user) ? "Win" : "Loss"}</td>
              </tr>
          `;
        });

        playerContent += `
            </tbody>
          </table>
        `;

        $("#player-content").append(playerContent);
        $("#player-table").DataTable();

        // $("#player-select").removeClass("disabled");
        $("#player-form").removeClass("loading");
      }).catch(err => {
        err.json()
          .then(data => {
            console.log(data);
          });
      });
  });

  $("#navbar > .item").tab();

  fetch(`${baseURL}/leaderboard?category=matchesWon`, { method: "GET" })
    .then(response => {
      if (response.ok) return response.json();
      else return Promise.reject(response);
    }).then(data => {
      console.log(data);
    }).catch(err => {
      err.json()
        .then(data => {
          console.log(data);
        });
    });

  fetch(`${baseURL}/users`, { method: "GET" })
    .then(response => {
      if (response.ok) return response.json();
      else return Promise.reject(response);
    }).then(data => {
      var options;

      data.forEach(user => options += `<option value="${user.id}">${user.name}</option>`);

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
});