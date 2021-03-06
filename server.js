const express = require('express');
const cors = require('cors');
const actions = require('./data/helpers/actionModel.js');
const projects = require('./data/helpers/projectModel.js');
const port = 6118;
const server = express();

server.use(express.json());
server.use(cors());

// #################### Custom Middleware ####################

const sendUserError = (status, message, res) => {
    return res.status(status).json({ errorMessage: message });
}

const getResources = (helper, helperStr, req, res, altGetMethod) => {
    if (!req) {
        helper.get()
            .then(get_response => {
                if (get_response.length === 0) {
                    return sendUserError(404, `There are no ${helperStr} in the database.`, res);
                }
                else {
                    res.json(get_response);
                }
            })
            .catch(error => {
                sendUserError(500, `The ${helperStr} information could not be retrieved or does not exist.`, res);
            })
    }
    else if (req && !altGetMethod) {
        const { id } = req.params;
        helper.get(id)
            .then(get_response => {
                if (!get_response) {
                    return sendUserError(404, `The ${helperStr} with the specified ID does not exist.`, res);
                }
                else {
                    res.json(get_response);
                }
            })
            .catch(error => {
                sendUserError(500, `The ${helperStr} information could not be retrieved or does not exist.`, res);
            })
    }
    else {
        const { id } = req.params;
        altGetMethod(id)
            .then(altGetMethod_response => {
                if (altGetMethod_response.length === 0) {
                    return sendUserError(404, `There are no ${helperStr[0]} for the specified ${helperStr[1]} ID.`, res);
                }
                else {
                    res.json(altGetMethod_response);
                }
            })
            .catch(error => {
                sendUserError(500, `The ${helper[1]}'s ${helper[0]} could not be retrieved or does not exist.`, res);
            })
    }
}

const postResources = (helper, helperStr, req, res) => {
    let obj = {};

    if (helperStr === 'projects') {
        const { name, description, completed } = req.body;

        if (!name || !description || (completed !== false && completed !== true)) {
            return sendUserError(404, 'Please provide a name, description, and a completed boolean result for the project.', res);
        }
        obj.name = name;
        obj.description = description;
        obj.completed = completed;
    }
    else if (helperStr === 'actions') {
        const { project_id, description, notes, completed } = req.body;

        if (!project_id || !description || !notes || (completed !== false && completed !== true)) {
            return sendUserError(404, 'Please provide a project id, description, notes, and a completed boolean result for the action.', res);
        }

        obj.project_id = project_id;
        obj.description = description;
        obj.notes = notes;
        obj.completed = completed;
    }

    helper.insert(obj)
        .then(insert_response => {
            helper.get(insert_response.id)
                .then(get_response => {
                    if (!get_response) {
                        sendUserError(404, `The ${helperStr.slice(0, -1)} with the specified ID does not exist.`, res);
                        return;
                    }
                    else {
                        res.json(get_response);
                    }
                })
                .catch(error => {
                    sendUserError(500, `The ${helperStr.slice(0, -1)} information could not be retrieved.`, res);
                })
        })
        .catch(error => {
            sendUserError(500, `There was an error while saving the ${helperStr.slice(0, -1)} to the database.`, res);
        })
}

const putResources = (helper, helperStr, req, res) => {
    let obj = {};
    const { id } = req.params;

    if (helperStr === 'projects') {
        const { name, description, completed } = req.body;

        if (!name || !description || (completed !== false && completed !== true)) {
            return sendUserError(404, 'Please provide a name, description, and a completed boolean result for the project.', res);
        }
        obj.name = name;
        obj.description = description;
        obj.completed = completed;
    }
    else if (helperStr === 'actions') {
        const { project_id, description, notes, completed } = req.body;

        if (!project_id || !description || !notes || (completed !== false && completed !== true)) {
            return sendUserError(404, 'Please provide a project id, description, notes, and a completed boolean result for the action.', res);
        }

        obj.project_id = project_id;
        obj.description = description;
        obj.notes = notes;
        obj.completed = completed;
    }

    helper.update(id, obj)
        .then(update_response => {
            if (update_response === 0) {
                return sendUserError(404, `The ${helperStr.slice(0, -1)} with the specified ID does not exist.`, res);
            }
            else {
                helper.get(id)
                    .then(get_response => {
                        res.json(get_response);
                    })
                    .catch(error => {
                        sendUserError(404, `The ${helperStr.slice(0, -1)} with the specified ID does not exist.`, res);
                    })
            }
        })
        .catch(error => {
            sendUserError(500, `The ${helperStr.slice(0, -1)} information could not be modified.`, res);
        })
}

const deleteResources = (helper, helperStr, req, res) => {
    let obj = {};
    let del = {};
    const { id } = req.params;

    helper.get(id)
        .then(get_response => {
            del = get_response;
            helper.remove(id)
                .then(remove_response => {
                    if (remove_response === 0) {
                        return sendUserError(404, `The ${helperStr} with the specified ID does not not exist.`, res);
                    }
                    else {
                        if (helperStr === 'project') {
                            for (let i = 0; i < del.actions.length; i++) {
                                actions.remove(del.actions[i].id)
                                    .then(remove_response => {
                                        if (remove_response === 0) {
                                            return sendUserError(404, 'The action with the specified ID does not exist.', res);
                                        }
                                    })
                                    .catch(error => {
                                        return sendUserError(500, 'There was an error while deleting the acion(s) for the project.', res);
                                    })
                            }
                        }
                        res.json(del);
                    }
                })
                .catch(error => {
                    sendUserError(500, `The ${helperStr} information could not be removed.`, res);
                })
        })
        .catch(error => {
            sendUserError(404, `The ${helperStr} with the specified ID does not exist.`, res);
        })
}

// #################### Endpoints ####################

server.get('/api/projects', (req, res) => {
    getResources(projects, 'projects', null, res, null);
});

server.get('/api/projects/:id', (req, res) => {
    getResources(projects, 'project', req, res, null);
});

server.get('/api/projects/:id/actions', (req, res) => {
    getResources(projects, ['actions', 'project'], req, res, projects.getProjectActions);
});

server.get('/api/actions', (req, res) => {
    getResources(actions, 'actions', null, res, null);
});

server.get('/api/actions/:id', (req, res) => {
    getResources(actions, 'action', req, res, null);
});

server.post('/api/projects/', (req, res) => {
    postResources(projects, 'projects', req, res);
});

server.post('/api/actions/', (req, res) => {
    postResources(actions, 'actions', req, res);
});

server.put('/api/projects/:id', (req, res) => {
    putResources(projects, 'projects', req, res);
});

server.put('/api/actions/:id', (req, res) => {
    putResources(actions, 'actions', req, res);
});

server.delete('/api/projects/:id', (req, res) => {
    deleteResources(projects, 'project', req, res);
});

server.delete('/api/actions/:id', (req, res) => {
    deleteResources(actions, 'action', req, res);
})

server.listen(port, () => console.log(`Server is running on port ${port}.`));