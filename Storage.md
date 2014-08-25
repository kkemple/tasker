## Storage

### Where is the data at!?

In Tasker, there are multiple ways data is passed about and stored. The reason for this is to reduce READ/WRITE actions to the computer.

#### localStorage

App settings, tasks, and JIRA login info are stored in localStorage. JIRA tasks get stored but are updated from the latest info from JIRA every time you navigate to the `JIRA Tasks` page.

You can back up localStorage at any point by going to the `App Settings` and clicking the `Backup Localstorage` button.

This information is backed up to `backup.json` in the root dir of the Tasker install.


#### backup.json

This is the file that holds the **latest** backup of your localStorage. It is overwritten each time you back up. In the future there is a possiblity that this will be versioned and you can restore to certain points.


#### Export to JSON
Tasks can also be exported to JSON so you can either share them with others, or upload them after clearing your localStorage.