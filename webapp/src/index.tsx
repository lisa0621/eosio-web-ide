// To see this in action, run this in a terminal:
//      gp preview $(gp url 8000)

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';
// import { test } from './test';

const rpc = new JsonRpc(''); // nodeos and web server are on same port
var pre_content = "No Content!";

interface PostData {
    id?: number;
    user?: string;
    reply_to?: number;
    content?: string;
};

interface PostFormState {
    privateKey: string;
    data: PostData;
    error: string;
};

class PostForm extends React.Component<{}, PostFormState> {
    api: Api;

    constructor(props: {}) {
        super(props);
        this.api = new Api({ rpc, signatureProvider: new JsSignatureProvider([]) });
        this.state = {
            privateKey: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
            data: {
                id: 0,
                user: 'bob',
                reply_to: 0,
                content: ''
            },
            error: ''
        };
    }

    setData(data: PostData) {
        this.setState({ data: { ...this.state.data, ...data } });
    }

    async post() {
        //var xx = (window as { [key: string]: any })["ida"].getDataList();  
        //console.log("['ida'].getDataList():" + xx);
        //set content:
        var get_content = (window as { [key: string]: any })["ida"].getDataList();
        console.log("get_content:" + get_content + "length:" + get_content.length);
        if (get_content.length > 0)
        {
            //this.setState({ pre_content: get_content.join() });
            pre_content = get_content.join();   
            this.state.data.content = pre_content;
            console.log("content:" + this.state.data.content);
        }
        if (this.state.data.content.length > 0)
        {
            try {
                this.api.signatureProvider = new JsSignatureProvider([this.state.privateKey]);
                const result = await this.api.transact(
                    {
                        actions: [{
                            account: 'talk',
                            name: 'post',
                            authorization: [{
                                actor: this.state.data.user,
                                permission: 'active',
                            }],
                            data: this.state.data,
                        }]
                    }, {
                        blocksBehind: 3,
                        expireSeconds: 30,
                    });
                console.log("Result:" + result);   
                //(window as { [key: string]: any })["ida"].setTestVal(this.state.data.reply_to);
                this.setState({ error: '' });
            } catch (e) {
                if (e.json)
                    this.setState({ error: JSON.stringify(e.json, null, 4) });
                else
                    this.setState({ error: '' + e });
            }
        }
    }

    render() {
        return <div>
            <table>
                <tbody>
                    <tr>
                        <td>Private Key</td>
                        <td><input
                            style={{ width: 500 }}
                            value={this.state.privateKey}
                            onChange={e => this.setState({ privateKey: e.target.value })}
                        /></td>
                    </tr>
                    <tr>
                        <td>User</td>
                        <td><input
                            style={{ width: 500 }}
                            value={this.state.data.user}
                            onChange={e => this.setData({ user: e.target.value })}
                        /></td>
                    </tr>
                    <tr>
                        <td>Reply To</td>
                        <td><input
                            style={{ width: 500 }}
                            value={this.state.data.reply_to}
                            onChange={e => this.setData({ reply_to: +e.target.value })}
                        /></td>
                    </tr>
                    <tr>
                        <td>Content</td>
                        <td><input
                            style={{ width: 500 }}
                            value={this.state.data.content}
                            onChange={e => this.setData({ content: e.target.value })}
                        /></td>
                    </tr>
                </tbody>
            </table>
            <br />
            <button onClick={e => this.post()}>Post</button>
            {this.state.error && <div>
                <br />
                Error:
                <code><pre>{this.state.error}</pre></code>
            </div>}
        </div>;
    }
}

class Messages extends React.Component<{}, { content: string }> {
    interval: number;

    constructor(props: {}) {
        super(props);
        this.state = { content: '///' };
        // console.log(test.prototype.title);
        // console.log(test.prototype.availableKeys);
        // console.log(test.prototype.getAvailableKeys());
        // console.log(test.prototype.cube(3));
        // console.log(test.prototype.hello());
        // console.log(test.prototype.getApiTest());
    }

    componentDidMount() {
        var postForm = new PostForm({});
        this.interval = window.setInterval(async () => {
            // var get_content = (window as { [key: string]: any })["ida"].getDataList();
            // console.log("get_content:" + get_content + "length:" + get_content.length);
            // if (get_content.length > 0)
            // {
            //     postForm.setState({ pre_content: get_content.join() });
                
            // }
            // if (postForm.state.data.content.length > 0)
            // {
            //     //postForm.post();
            // }           
            postForm.post();
            try {
                const rows = await rpc.get_table_rows({
                    json: true, code: 'talk', scope: '', table: 'message', limit: 1000,
                });
                let content =
                    'id          reply_to      user          content\n' +
                    '=============================================================\n';
                for (let row of rows.rows)
                    content +=
                        (row.id + '').padEnd(12) +
                        (row.reply_to + '').padEnd(12) + '  ' +
                        row.user.padEnd(14) +
                        row.content + '\n';
                this.setState({ content });
            } catch (e) {
                if (e.json)
                    this.setState({ content: JSON.stringify(e.json, null, 4) });
                else
                    this.setState({ content: '' + e });
            }

        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return <code><pre>{this.state.content}</pre></code>;
    }
}

ReactDOM.render(
    <div>
        <PostForm />
        <br />
        Messages:
        <Messages />
    </div>,
    document.getElementById("example")
);
