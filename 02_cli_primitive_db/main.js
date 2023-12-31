import inquirer from 'inquirer';
import fs from 'fs';

const DATABASE_FILE_NAME = 'database.txt';
let users = [];

const loadDatabase = () => {
    try {
        const data = fs.readFileSync(DATABASE_FILE_NAME, 'utf8');
        users = JSON.parse(data);
    } catch (error) {
        users = [];
    }
}

const saveDatabase = () => {
    fs.writeFileSync(DATABASE_FILE_NAME, JSON.stringify(users), 'utf8');
}

const ageValidation = (input) => {
    const age = parseInt(input);
    if (isNaN(age)) {
        return 'Please enter a valid number for age.';
    }
    if (age < 0) {
        return 'Age cannot be negative.';
    }
    return true;
}

const addUser = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "Enter the user's name. To cancel press ENTER:",
        },
    ]);
    if (answers.name) {
        await promptForUserInfo(answers.name);
    } else {
        saveDatabase();
        await searchOrExit();
    }
}

const promptForUserInfo = async (name) => {
    const userInfo = await inquirer.prompt([
        {
            type: 'list',
            name: 'gender',
            message: 'Choose your Gender:',
            choices: ['Male', 'Female'],
        },
        {
            type: 'input',
            name: 'age',
            message: 'Enter your age:',
            validate: ageValidation,
        },
    ]);

    users.push({name, ...userInfo});
    await addUser();
}

const searchOrExit = async () => {
    const answer = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'search',
            message: 'Would you search values in DB?',
        },
    ]);
    if (answer.search) {
        await searchUser();
    } else {
        console.log('Exiting the application.');
    }
}

const searchUser = async () => {
    console.log(users);
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'searchName',
            message: "Enter user's name you wanna find in DB:",
        },
    ]);

    const searchName = answer.searchName.toLowerCase();
    const foundUsers = users.filter((user) => user.name.toLowerCase() === searchName);

    if (foundUsers.length) {
        console.log(`Found ${foundUsers.length} matches for your query ${answer.searchName}:`);
        console.log(foundUsers);
    } else {
        console.log('User not found in the database.');
    }
}

const main = async () => {
    loadDatabase();
    await addUser();
}

main();
