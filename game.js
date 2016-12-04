var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var frame;
var over=0;

var table, Mallet1, Mallet2, Puck;

var user_score = 0, computer_score = 0;

Mouse_position =
    {
	x:0,
	y:0
    };

function ChangeCoordinates(event)
{
    Mouse_position.x = event.clientX;
    Mouse_position.y = event.clientY;
}

function Initial_position()
{
    table = 
	{
	    height:350,
	    width:700,
	    start_x:10,
	    start_y:10,
	    border_color:'rgb( 0, 0, 0)',
	    border_line_width:6,
	    
	    goal1_x:7,
	    goal2_x:707,
	    goal_length:100,
	    goal_color:'rgb(220, 0, 0)',

	    middle_circle_radius:80,
	    
	    draw : function()
	    {
		ctx.beginPath();
		ctx.strokeStyle = this.border_color;
		ctx.lineWidth = this.border_line_width;
		ctx.rect(this.start_x, this.start_y, this.width, this.height);
		ctx.stroke();
		ctx.closePath();

    		goal_start_y = this.height/2 + this.start_y - this.goal_length/2,

		ctx.beginPath();
		ctx.fillStyle = this.goal_color;
		ctx.fillRect(this.goal1_x, goal_start_y, this.border_line_width, this.goal_length);
		ctx.fillRect(this.goal2_x, goal_start_y, this.border_line_width, this.goal_length);

		middle_line_x = this.width/2 + this.start_x - this.border_line_width/2;
		ctx.fillStyle = this.border_color;
		ctx.fillRect(middle_line_x, this.start_y, this.border_line_width, this.height);

		circle_x = middle_line_x + this.border_line_width/2;
		circle_y = goal_start_y + this.goal_length/2;

		ctx.beginPath();
		ctx.arc(circle_x, circle_y, this.middle_circle_radius, 0, 2*Math.PI);
		ctx.stroke();
		ctx.closePath();
		
	    }
	};

    Mallet1 = {
	x: table.start_x + 40,
	y: table.height/2 + table.start_y,
	radius: 25,
	color: 'green',
	draw: function() {
	    ctx.beginPath();
	    ctx.strokeStyle = this.color;
	    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
	    ctx.closePath();
	    ctx.fillStyle = this.color;
	    ctx.fill();
	}
    };


    Mallet2 = {
	x: table.start_x + table.width - 40,
	y: table.height/2 + table.start_y,

	x_max_threshold: table.height/2 + table.width - 70,
	x_min_thershold: table.height/2 + table.width - 370,

	radius: 25,
	color: 'yellow',

	velocity_max_x:2.0,
	velocity_max_y:2.0,
	
	draw: function() {
	    ctx.beginPath();
	    ctx.strokeStyle = this.color;
	    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
	    ctx.closePath();
	    ctx.fillStyle = this.color;
	    ctx.fill();
	}
    };

    Puck = {
	x: table.width/2 + table.start_x - table.middle_circle_radius + 40,
	y: table.height/2 + table.start_y,

	radius: 15,
	color: 'darkblue',

	velocity_x: 0,
	velocity_y: 0,
	acceleration: 1.0,

	draw: function() {
	    ctx.beginPath();
	    ctx.strokeStyle = this.color;
	    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
	    ctx.closePath();
	    ctx.fillStyle = this.color;
	    ctx.fill();
	}
    };

}
	
function getAreaNumber()
{
    y_min = table.start_y + table.border_line_width/2;
    x_min = table.start_x + table.border_line_width/2;    

    y_max = table.height + table.start_y - table.border_line_width/2;
    x_max = table.width/2 + table.start_x - table.border_line_width/2;

    if(Puck.x < x_max && Puck.x > x_min && Puck.y < y_max && Puck.y > y_min)
	return 1;
    return 2;

}


function MoveMallet1()
{
    current_x = Mouse_position.x - 307;
    current_y = Mouse_position.y - 127;

    y_min = table.start_y + table.border_line_width/2;
    x_min = table.start_x + table.border_line_width/2;    

    y_max = table.height + table.start_y - table.border_line_width/2;
    x_max = table.width/2 + table.start_x - table.border_line_width/2;    
    
    r = Mallet1.radius;

    
    if(current_x - r  > x_min && current_y - r > y_min && current_y + r < y_max && current_x + r < x_max )
    {	
	Mallet1.x = current_x;
	Mallet1.y = current_y;
    }


}

function MoveMallet2()
{
    
    if(Math.abs(Puck.x - Mallet2.x) < 10 && Math.abs(Puck.y - Mallet2.y) < 20)
	Mallet2.x += 2*Mallet2.velocity_max_x;

    current_y = Mallet2.y;
    current_puck_y = Puck.y;
	
    if(current_y < current_puck_y)
	Mallet2.y += Mallet2.velocity_max_y;
    else if(current_y > current_puck_y)
	Mallet2.y -= Mallet2.velocity_max_y;

    current_x = Mallet2.x;
    if(Puck.x > Mallet2.x)
	Mallet2.x += Mallet2.velocity_max_x;
    else if((Puck.velocity_x < 1 && Puck.velocity_y < 1 && getAreaNumber() == 2 && Mallet2.x > Mallet2.x_min_thershold) || Mallet2.x > Mallet2.x_max_thershold)
	Mallet2.x -= Mallet2.velocity_max_x;
    else if((Puck.velocity_x > 1 || Puck.velocity_y > 1) && Mallet2.x < Mallet2.x_min_thershold)
	Mallet2.x += Mallet2.velocity_max_x;

    r = Mallet2.radius;
    
    x_min = table.width/2 + table.start_x + table.border_line_width/2 + r;
    x_max = table.width + table.start_x - table.border_line_width/2 - r;

    y_min = table.start_y + table.border_line_width/2 + r;
    y_max = table.height + table.start_y - table.border_line_width/2 - r;

    if(Mallet2.x < x_min)
    {
	Mallet2.x = x_min;
    }
    if(Mallet2.x > x_max)
    {
	Mallet2.x = x_max;
	if(Puck.x > x_max)
	    Puck.velocity_y = -4;
    }
    if(Mallet2.y < y_min)
    {
	Mallet2.y = y_min;
	if(Puck.y < y_min  && Math.abs(Puck.x - Mallet2.x) < 10)
	    Puck.velocity_x = -4;
	if(Puck.x >= x_max)
	{
	    Puck.velocity_y = 4;
	    Puck.x -= 30;
	    Puck.y += 30;
	}
    }
    if(Mallet2.y > y_max)
    {
	Mallet2.y = y_max;
	if(Puck.y > y_max  && Math.abs(Puck.x - Mallet2.x) < 10)
	    Puck.velocity_x = -4;
    }
    
}

function MovePuck()
{
    Puck.x += Puck.velocity_x;
    Puck.y += Puck.velocity_y;
    Puck.velocity_x *= Puck.acceleration;
    Puck.velocity_y *= Puck.acceleration;

    r = Puck.radius;
    
    x_min = table.start_x + table.border_line_width/2 + r;
    x_max = table.width + table.start_x - table.border_line_width/2 - r;

    y_min = table.start_y + table.border_line_width/2 + r;
    y_max = table.height + table.start_y - table.border_line_width/2 - r;

    
    x = Puck.x;
    y = Puck.y;

    if(x < x_min) x = x_min;
    if(y < y_min) y = y_min;
    if(x > x_max) x = x_max;
    if(y > y_max) y = y_max;

    Puck.x = x;
    Puck.y = y;
}

function distanceBetween(x1, y1, x2, y2)
{
    delta_x = Math.pow((x1 - x2), 2);
    delta_y = Math.pow((y1 - y2), 2);

    return Math.sqrt(delta_x + delta_y);
}
 
function checkCollisionPuckAndMallet1()
{
    mallet_x = Mallet1.x;
    mallet_y = Mallet1.y;

    puck_x = Puck.x;
    puck_y = Puck.y;

    r1 = Mallet1.radius;
    r2 = Puck.radius;

    if(distanceBetween(puck_x, puck_y, mallet_x, mallet_y) > r1+r2)
	return false;

    Puck.velocity_x = (puck_x - mallet_x)/(r1+r2)*4;
    Puck.velocity_y = (puck_y - mallet_y)/(r1+r2)*4;

    return true;
    
}

function checkCollisionPuckAndMallet2()
{
    mallet_x = Mallet2.x;
    mallet_y = Mallet2.y;

    puck_x = Puck.x;
    puck_y = Puck.y;

    r1 = Mallet2.radius;
    r2 = Puck.radius;

    if(distanceBetween(puck_x, puck_y, mallet_x, mallet_y) > r1+r2)
	return false;

    Puck.velocity_x = (puck_x - mallet_x)/(r1+r2)*4;
    Puck.velocity_y = (puck_y - mallet_y)/(r1+r2)*4;

    return true;
    
}

function checkCollisionPuckAndTable()
{
    r = Puck.radius;
    
    x_min = table.start_x + table.border_line_width/2 + r;
    x_max = table.width + table.start_x - table.border_line_width/2 - r;

    y_min = table.start_y + table.border_line_width/2 + r;
    y_max = table.height + table.start_y - table.border_line_width/2 - r;

    
    x = Puck.x;
    y = Puck.y;

    vel_x = Puck.velocity_x;
    vel_y = Puck.velocity_y;
    
    if( x+vel_x < x_min || x+vel_x > x_max)
	Puck.velocity_x *= -1;
    else if(y+vel_y < y_min || y+vel_y > y_max)
	Puck.velocity_y *= -1;
}

function checkGoal()
{
    r = Puck.radius;
    
    new_pos_x = Puck.x + Puck.velocity_x;
    new_pos_y = Puck.y + Puck.velocity_y;

    goal1_x = table.goal1_x;
    goal2_x = table.goal2_x;

    goal_y_start = table.height/2 + table.start_y - table.goal_length/2;
    goal_y_end = goal_y_start + table.goal_length;

    if(new_pos_x - table.border_line_width - r < goal1_x && new_pos_y < goal_y_end && new_pos_y > goal_y_start)
    {
	computer_score += 1;
	document.getElementById('computer').innerHTML = computer_score;
	return true;
    }

    if(new_pos_x + r > goal2_x && new_pos_y < goal_y_end && new_pos_y > goal_y_start)
    {
	user_score += 1;
	document.getElementById('user').innerHTML = user_score;
	return true;
    }

    return false;

}

function draw() {

    is_goal = checkGoal();

    if(is_goal)
	Initial_position();

    if(user_score == 7 || computer_score == 7)
    {
	window.cancelAnimationFrame(frame);
	gameover();
    }
    
    
    area_number = getAreaNumber();
    var collision = false;
    
    if(area_number == 1)
	collision = checkCollisionPuckAndMallet1();
    else
	collision = checkCollisionPuckAndMallet2();

    if(collision === false)
	checkCollisionPuckAndTable();
    
    MoveMallet1();
    MoveMallet2();
    MovePuck();
    
    ctx.clearRect(0,0, canvas.width, canvas.height);

    table.draw();
    Mallet1.draw();
    Mallet2.draw();
    Puck.draw();

    frame = window.requestAnimationFrame(draw);
}

window.addEventListener('load', function(){

    Initial_position();
    table.draw();
    frame = window.requestAnimationFrame(draw);
});

function gameover()
{
    result = "";

    window.cancelAnimationFrame(frame);
    
    if(user_score == 7)
	result = "You Win";
    else
	result = "You Lose";

    document.getElementById('result').innerHTML = result;
}
