// Copyright 2019 witchof0x20
// This file is part of popn_class_struggle.
// 
// popn_class_struggle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// popn_class_struggle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with popn_class_struggle.  If not, see <https://www.gnu.org/licenses/>.

/// All possible pop'n levels
const ALL_LEVELS = [...Array(50).keys()].map((x) => x + 1);
// Default value for pop'n clas
const POPN_CLASS_DEFAULT = 57.30;
/// Bonus for CLEAR/EASYCLEAR
const CLEAR_BONUS = 3000;
/// Bonus for FC/PERFECT
const FULLCLEAR_BONUS = 5000;
/// Minimum score required to update popn class
const POPN_CLASS_MINSCORE = 50000;
/// Maximum pop'n score
const POPN_MAXSCORE = 100000;

/// Initializes the table with rows for each level
/// table: the table to initialize
/// levels: levels to add to the table
function initialize_score_table(table, levels) {
    // Add levels to the table, in reverse order of the given list
    for(let level of levels) {
        // Create a row
        let cur_row = table.insertRow(1);
        // Create cells
        let level_cell = cur_row.insertCell(0);
        let fail_cell = cur_row.insertCell(1);
        let clear_cell = cur_row.insertCell(2);
        let fullclear_cell = cur_row.insertCell(3);
        // Write the level into the level cell
        level_cell.textContent = level.toString();
        // Set styles for the score cells
        fail_cell.classList.add("fail");
        clear_cell.classList.add("clear");
        fullclear_cell.classList.add("fullclear");
    }
}
/// Calculates the required fail score to earn a specific pop'n class
/// popn_class: the target pop'n class
/// level: the level of the the song
function calculate_fail_score_for_class(popn_class, level) {
    return (5440 * popn_class) - (10000 * level) + POPN_CLASS_MINSCORE;
}

/// Updates a cell given a score, and the CSS class that should be
/// set if the score is not impossible
/// cell: the <td> element
/// score: the score that should be stores
/// default_style: the css class used for possible scores
/// RETURN: whether the given score is impossible
function update_score_cell(cell, score, default_style) {
    // Clamp the score and store it to the cell
    // This is because only certain scores will affect pop'n class
    cell.textContent = Math.ceil(Math.max(score, POPN_CLASS_MINSCORE));
    // Check if the score is impossible
    let impossible = score > POPN_MAXSCORE;
    if(impossible) {
        cell.classList.remove(default_style);
        cell.classList.add("impossible");
    }
    else {
        cell.classList.remove("impossible");
        cell.classList.add(default_style);
    }
    return impossible;
}

/// Updates the score table given a pop'n class
/// Assumes the table has been initialized
/// table: the score table
/// popn_class: the pop'n class to update the table for
function update_score_table(table, popn_class) {
    // Iterate over the table rows
    for(let row of Array.from(table.rows).slice(1)) {
        // Get all cells
        let level_cell = row.cells[0];
        let fail_cell = row.cells[1];
        let clear_cell = row.cells[2];
        let fullclear_cell = row.cells[3];
        // Parse the level out of the row
        let level = parseInt(level_cell.textContent);
        // Calculate the fail score for the given pop'n class and level
        let fail_score = calculate_fail_score_for_class(popn_class, level);
        // Calculate clear and fullclear scores
        let clear_score = fail_score - CLEAR_BONUS;
        let fullclear_score = fail_score - FULLCLEAR_BONUS;
        // Update the score cells
        update_score_cell(fail_cell, fail_score, "fail");
        update_score_cell(clear_cell, clear_score, "clear");
        let impossible = update_score_cell(fullclear_cell, fullclear_score, "fullclear");
        // If a popn class upgrade isn't possible, even with a full clear, grey out the level cell
        if(impossible) {
            level_cell.classList.add("impossible");
        }
        else {
            level_cell.classList.remove("impossible");
        }
    }
}

/// Updates the tier label
/// span: tier label span
/// popn_class: pop'n class
function update_tier_label(span, popn_class) {
    let tier_name = "";
    let tier_class = "";
    // Decide tier name and css class based on pop'n class
    if(popn_class >= 0 && popn_class <= 20.99) {
        tier_name = "にゃんこ";
        tier_class = "classtier1";
    }
    else if(popn_class <= 33.99) {
        tier_name = "小学生";
        tier_class = "classtier2";
    }
    else if(popn_class <= 45.99) {
        tier_name = "番長";
        tier_class = "classtier3";
    }
    else if(popn_class <= 58.99) {
        tier_name = "刑事";
        tier_class = "classtier4";
    }
    else if(popn_class <= 67.99) {
        tier_name = "アイドル";
        tier_class = "classtier5";
    }
    else if(popn_class <= 78.99) {
        tier_name = "将軍";
        tier_class = "classtier6";
    }
    else if(popn_class <= 90.99) {
        tier_name = "仙人";
        tier_class = "classtier7";
    }
    else if(popn_class >= 91.00) {
        tier_name = "神";
        tier_class = "classtier8";
    }
    else {
        throw new Error("Invalid pop'n class");
    }
    span.textContent = tier_name;
    span.className = tier_class;
}

/// Run at start
function main() {
    // Get the pop'n class input box
    let input_popn_class = document.getElementById("popn_class");
    if(input_popn_class == null) {
      throw new Error("Failed to find pop'n class input");
    }
    // Get the pop'n class tier span
    let span_class_tier = document.getElementById("class_tier");
    if(span_class_tier == null) {
      throw new Error("Failed to find class tier span");
    }
    //Get the table
    let table_scores = document.getElementById("scores");
    if(table_scores == null) {
      throw new Error("Failed to find score table");
    }

    // Set a default value for the pop'n class
    input_popn_class.defaultValue = POPN_CLASS_DEFAULT; 
    input_popn_class.placeholder = POPN_CLASS_DEFAULT; 
    
    // Initialize the table
    initialize_score_table(table_scores, ALL_LEVELS);
    // Add a function to the pop'n class input that updates the table on change
    input_popn_class.oninput = function() {
        if(input_popn_class.checkValidity()) {
            update_tier_label(span_class_tier, input_popn_class.valueAsNumber);
            update_score_table(table_scores, input_popn_class.valueAsNumber);
        }
    };
    // Call the update function manually
    input_popn_class.oninput();
}

main();
