var Time = 60; //second //制限時間
var interval = 300; //ms 
var score = 0;
var timer //タイマーID;

var date = new Date();
var startTime;
var no1;
var no2;
var maxNum = 99;

var ranki_in_flag = false;
var rank_in_Score = { "9": { "score": - 1, "name": "none" }, "19": { score: - 1, name: "none" }, "99": { score: - 1, name: "none" } }; //連想配列
var selected_difficulty = 99;

var db = firebase.database();       //.jsの読み込み順番に注意                                                                                                                                         
var database99 = db.ref("/9999");

function loadScore()
{
    database99.on("value", function (snapshot)
    {
        snapshot.forEach(function (childSnapshot)
        {
            var childData = childSnapshot.val();
            if (parseInt(childData.score) > rank_in_Score[childData.difficulty]["score"])
            {
                rank_in_Score[childData.difficulty]["score"] = parseInt(childData.score);
                rank_in_Score[childData.difficulty]["name"] = childData.name;
            }
        });
        document.getElementById("9_score").innerHTML = rank_in_Score["9"]["score"]
        document.getElementById("9_name").innerHTML = rank_in_Score["9"]["name"]
        document.getElementById("19_score").innerHTML = rank_in_Score["19"]["score"]
        document.getElementById("19_name").innerHTML = rank_in_Score["19"]["name"]
        document.getElementById("99_score").innerHTML = rank_in_Score["99"]["score"]
        document.getElementById("99_name").innerHTML = rank_in_Score["99"]["name"]
    });

}

function genereteProb()
{
    no1 = Math.floor(Math.random() * maxNum);
    no2 = Math.floor(Math.random() * maxNum);
    document.getElementById("no1").innerText = no1;
    document.getElementById("no2").innerText = no2;
    document.getElementById("ans").value = "";
}

function answerCheck()
{
    var nowTime = new Date();
    if (nowTime - startTime > 1000 * Time)
    {
        end();
    }

    var ans = document.getElementById("ans").value;

    if (no1 * no2 == parseInt(ans, 10))
    {
        score += 1;
        document.getElementById("score").innerHTML = score;
        genereteProb();
    } else if (ans == "z")
    {
        genereteProb();
    }
}
function end()
{
    clearInterval(timer); //タイマーストップ

    document.getElementById("no1").innerText = "_";
    document.getElementById("no2").innerText = "_";
    var score = document.getElementById("score").innerHTML;

    if (parseInt(score) > rank_in_Score[selected_difficulty]["score"])
    {
        window.location.href = "login.html?score=" + score + "&selected_difficulty=" + selected_difficulty;
    }
    else
    {
        alert("Time Up ! \n もうちょっとですね。");
    }
}

function start()
{
    startTime = new Date();
    const difficulty = document.form1.difficulty;
    document.getElementById("score").innerHTML = 0;
    if (difficulty[0].checked)
    {
        maxNum = 10;
        selected_difficulty = "9";
    }
    else if (difficulty[1].checked)
    {
        maxNum = 20;
        selected_difficulty = "19";
    }
    else
    {
        maxNum = 100;
        selected_difficulty = "99";
    }
    timer = setInterval(answerCheck, interval); //タイマースタート

    genereteProb();
}

function pass()
{
    genereteProb();
}

function updateNewScpre(score, difficulty, user, userid)
{
    database99.push({
        score: score,
        difficulty: difficulty,
        name: user,
        userid: userid
    });
}

window.onload = function ()
{
    loadScore()
};

