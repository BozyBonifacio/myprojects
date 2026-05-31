// Project catalogue. Edit this list to add / remove / reorder cards.
// `repo` must match the GitHub repository name so live stats can be fetched.
// `demo` is optional — set it to a live URL or leave it null.
//
// `shots` is an App-Store-style gallery. Each shot is one of:
//   { kind: "image",    frame: "browser"|"phone", src: "screenshots/x.png", caption }
//   { kind: "terminal", title, prompt, lines: [{ t: "text", c: "ok|warn|err|dim|add|head" }] }
//   { kind: "cost",     title, currency, rows: [{ name, detail, monthly }], note }
//   { kind: "screen",   frame: "browser"|"phone", title, html, caption }
// To use real screenshots, drop PNGs into the screenshots/ folder and switch a
// shot to kind:"image" with its `src`. Everything renders without any image files.

window.PROJECTS = [
  {
    title: "terraform-infracost",
    repo: "terraform-infracost",
    blurb: "Infrastructure-as-Code experiments with Terraform — integration with InfraCost. Shift left for cost tracking.",
    tags: ["Terraform", "IaC", "Cloud"],
    icon: "🏗️",
    demo: null,
    shots: [
      {
        kind: "image",
        frame: "browser",
        src: "screenshots/infracost1.png",
        caption: "Infracost — monthly cost estimate",
      },
      {
        kind: "terminal",
        title: "terraform plan",
        prompt: "~/terraform-infracost",
        lines: [
          { t: "$ terraform plan", c: "cmd" },
          { t: "Acquiring state lock. This may take a few moments...", c: "dim" },
          { t: "" },
          { t: "Terraform will perform the following actions:", c: "head" },
          { t: "" },
          { t: "  # aws_instance.web will be created", c: "dim" },
          { t: "  + resource \"aws_instance\" \"web\" {", c: "add" },
          { t: "      + ami           = \"ami-0abcd1234\"", c: "add" },
          { t: "      + instance_type = \"t3.micro\"", c: "add" },
          { t: "      + public_ip     = (known after apply)", c: "add" },
          { t: "    }", c: "add" },
          { t: "" },
          { t: "Plan: 7 to add, 0 to change, 0 to destroy.", c: "head" },
          { t: "" },
          { t: "✔ Plan saved to: tfplan", c: "ok" },
          { t: "" },
          { t: "$ infracost diff --path .", c: "cmd" },
          { t: "" },
          { t: "Key: * usage cost, ~ changed, + added, - removed", c: "dim" },
          { t: "" },
          { t: "──────────────────────────────────", c: "dim" },
          { t: "Project: dev", c: "head" },
          { t: "Module path: environments/dev", c: "dim" },
          { t: "" },
          { t: "+ module.example_workload.aws_db_instance.app", c: "add" },
          { t: "  +$14", c: "add" },
          { t: "" },
          { t: "    + Database instance (on-demand, Single-AZ, db.t4g.micro)", c: "add" },
          { t: "      +$12", c: "add" },
          { t: "" },
          { t: "    + Storage (general purpose SSD, gp3)", c: "add" },
          { t: "      +$2", c: "add" },
          { t: "" },
          { t: "+ module.example_workload.aws_instance.app", c: "add" },
          { t: "  +$7", c: "add" },
          { t: "" },
          { t: "    + Instance usage (Linux/UNIX, on-demand, t4g.micro)", c: "add" },
          { t: "      +$6", c: "add" },
          { t: "" },
          { t: "    + root_block_device", c: "add" },
          { t: "" },
          { t: "        + Storage (general purpose SSD, gp2)", c: "add" },
          { t: "          +$0.80", c: "add" },
          { t: "" },
          { t: "+ module.example_workload.aws_ebs_volume.data", c: "add" },
          { t: "  +$2", c: "add" },
          { t: "" },
          { t: "    + Storage (general purpose SSD, gp3)", c: "add" },
          { t: "      +$2", c: "add" },
          { t: "" },
          { t: "Monthly cost change for dev (Module path: environments/dev)", c: "head" },
          { t: "Amount:  +$23 ($0.00 → $23)", c: "ok" },
          { t: "" },
          { t: "──────────────────────────────────", c: "dim" },
          { t: "Project: prod", c: "head" },
          { t: "Module path: environments/prod", c: "dim" },
          { t: "" },
          { t: "+ module.example_workload.aws_db_instance.app", c: "add" },
          { t: "  +$59", c: "add" },
          { t: "" },
          { t: "    + Database instance (on-demand, Single-AZ, db.t4g.medium)", c: "add" },
          { t: "      +$47", c: "add" },
          { t: "" },
          { t: "    + Storage (general purpose SSD, gp3)", c: "add" },
          { t: "      +$12", c: "add" },
          { t: "" },
          { t: "+ module.example_workload.aws_instance.app", c: "add" },
          { t: "  +$50", c: "add" },
          { t: "" },
          { t: "    + Instance usage (Linux/UNIX, on-demand, t4g.large)", c: "add" },
          { t: "      +$49", c: "add" },
          { t: "" },
          { t: "    + root_block_device", c: "add" },
          { t: "" },
          { t: "        + Storage (general purpose SSD, gp2)", c: "add" },
          { t: "          +$0.80", c: "add" },
          { t: "" },
          { t: "+ module.example_workload.aws_ebs_volume.data", c: "add" },
          { t: "  +$8", c: "add" },
          { t: "" },
          { t: "    + Storage (general purpose SSD, gp3)", c: "add" },
          { t: "      +$8", c: "add" },
          { t: "" },
          { t: "Monthly cost change for prod (Module path: environments/prod)", c: "head" },
          { t: "Amount:  +$117 ($0.00 → $117)", c: "ok" },
          { t: "" },
          { t: "──────────────────────────────────", c: "dim" },
          { t: "Key: * usage cost, ~ changed, + added, - removed", c: "dim" },
          { t: "" },
          { t: "*Usage costs can be estimated by updating Infracost Cloud settings, see docs for other options.", c: "dim" },
          { t: "" },
          { t: "6 cloud resources were detected:", c: "head" },
          { t: "∙ 6 were estimated", c: "dim" },
          { t: "" },
          { t: "Infracost estimate: Monthly estimate increased by $139 ↑", c: "warn" },
          { t: "┏━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┓", c: "dim" },
          { t: "┃ Changed project  ┃ Baseline cost ┃ Usage cost* ┃ Total change ┃", c: "head" },
          { t: "┣━━━━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━╋━━━━━━━━━━━━━╋━━━━━━━━━━━━━━┫", c: "dim" },
          { t: "┃ dev              ┃          +$23 ┃           - ┃         +$23 ┃", c: "add" },
          { t: "┃ prod             ┃         +$117 ┃           - ┃        +$117 ┃", c: "add" },
          { t: "┗━━━━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━━━┻━━━━━━━━━━━━━┻━━━━━━━━━━━━━━┛", c: "dim" },
        ],
      },
    ],
  },
  {
    title: "terraformstuffs",
    repo: "terraformstuffs",
    blurb: "A grab-bag of Terraform modules and configurations — reusable patterns and learning notes.",
    tags: ["Terraform", "IaC"],
    icon: "📦",
    demo: null,
    shots: [
      {
        kind: "terminal",
        title: "terraform apply",
        prompt: "~/terraformstuffs/modules/vpc",
        lines: [
          { t: "$ terraform apply -auto-approve", c: "cmd" },
          { t: "module.vpc.aws_vpc.this: Creating...", c: "dim" },
          { t: "module.vpc.aws_vpc.this: Creation complete after 2s", c: "ok" },
          { t: "module.vpc.aws_subnet.public[0]: Creation complete", c: "ok" },
          { t: "module.vpc.aws_subnet.public[1]: Creation complete", c: "ok" },
          { t: "module.vpc.aws_nat_gateway.this: Creation complete after 1m", c: "ok" },
          { t: "" },
          { t: "Apply complete! Resources: 12 added, 0 changed, 0 destroyed.", c: "head" },
          { t: "" },
          { t: "Outputs:", c: "head" },
          { t: "vpc_id = \"vpc-0a1b2c3d\"", c: "dim" },
          { t: "public_subnet_ids = [\"subnet-0aa\", \"subnet-0bb\"]", c: "dim" },
        ],
      },
    ],
  },
  {
    title: "k8stest",
    repo: "k8stest",
    blurb: "Test projects for Docker and Kubernetes — containerising apps and exploring orchestration.",
    tags: ["Kubernetes", "Docker", "DevOps"],
    icon: "☸️",
    demo: null,
    shots: [
      {
        kind: "terminal",
        title: "kubectl",
        prompt: "~/k8stest",
        lines: [
          { t: "$ kubectl get pods -n demo", c: "cmd" },
          { t: "NAME                      READY   STATUS    RESTARTS   AGE", c: "head" },
          { t: "api-7d9f8c6b5-2xk4n       1/1     Running   0          4m12s", c: "ok" },
          { t: "api-7d9f8c6b5-9plqz       1/1     Running   0          4m12s", c: "ok" },
          { t: "web-5c8b7a4d2-mn7vd       1/1     Running   0          4m12s", c: "ok" },
          { t: "redis-0                   1/1     Running   0          4m12s", c: "ok" },
          { t: "", c: "dim" },
          { t: "$ kubectl get svc web -n demo", c: "cmd" },
          { t: "NAME   TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)", c: "head" },
          { t: "web    LoadBalancer   10.0.142.31    34.122.18.9     80:31840/TCP", c: "ok" },
        ],
      },
    ],
  },
  {
    title: "databricks",
    repo: "databricks",
    blurb: "Databricks scripts and notebooks for data engineering and analytics workflows.",
    tags: ["Python", "Databricks", "Data"],
    icon: "📊",
    demo: null,
    shots: [
      {
        kind: "screen",
        frame: "browser",
        title: "notebook output",
        caption: "Spark aggregation rendered as a bar chart in a Databricks notebook.",
        html:
          '<div class="mk-nb">' +
          '<div class="mk-nb__cell">spark.sql("SELECT region, SUM(sales) FROM trips GROUP BY region")</div>' +
          '<div class="mk-nb__out">' +
          '<div class="mk-chart">' +
          '<div class="mk-bar" style="height:78%"><span>EU</span></div>' +
          '<div class="mk-bar" style="height:96%"><span>US</span></div>' +
          '<div class="mk-bar" style="height:54%"><span>APAC</span></div>' +
          '<div class="mk-bar" style="height:40%"><span>LATAM</span></div>' +
          '<div class="mk-bar" style="height:30%"><span>MEA</span></div>' +
          "</div></div></div>",
      },
    ],
  },
  {
    title: "fuel-consumption-tracker",
    repo: "fuel-consumption-tracker",
    blurb: "A TypeScript app to log and visualise vehicle fuel consumption over time.",
    tags: ["TypeScript", "App"],
    icon: "⛽",
    demo: null,
    shots: [
      {
        kind: "screen",
        frame: "phone",
        title: "dashboard",
        caption: "Per-fill log with running average consumption and cost.",
        html:
          '<div class="mk-app">' +
          '<div class="mk-app__bar">Fuel Tracker</div>' +
          '<div class="mk-kpis">' +
          '<div class="mk-kpi"><b>7.4</b><small>L / 100km</small></div>' +
          '<div class="mk-kpi"><b>$182</b><small>this month</small></div>' +
          "</div>" +
          '<div class="mk-list">' +
          '<div class="mk-li"><span>12 May · 42.1 L</span><b>$71.2</b></div>' +
          '<div class="mk-li"><span>03 May · 38.6 L</span><b>$65.4</b></div>' +
          '<div class="mk-li"><span>24 Apr · 40.0 L</span><b>$67.8</b></div>' +
          "</div>" +
          '<div class="mk-fab">+</div>' +
          "</div>",
      },
    ],
  },
  {
    title: "fuel-market-monitor",
    repo: "fuel-market-monitor",
    blurb: "Monitors fuel market prices and surfaces trends — a TypeScript data project.",
    tags: ["TypeScript", "Data"],
    icon: "📈",
    demo: null,
    shots: [
      {
        kind: "screen",
        frame: "browser",
        title: "price trend",
        caption: "Weekly retail price trend with 7-day moving average.",
        html:
          '<div class="mk-mon">' +
          '<div class="mk-mon__head"><span>Petrol 95 · national avg</span><b class="mk-up">$1.92 ▲ 2.1%</b></div>' +
          '<svg viewBox="0 0 320 120" class="mk-spark" preserveAspectRatio="none">' +
          '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="rgba(33,212,253,.35)"/><stop offset="100%" stop-color="rgba(33,212,253,0)"/>' +
          "</linearGradient></defs>" +
          '<path d="M0,90 40,82 80,86 120,60 160,66 200,40 240,48 280,26 320,20 320,120 0,120 Z" fill="url(#g)"/>' +
          '<path d="M0,90 40,82 80,86 120,60 160,66 200,40 240,48 280,26 320,20" fill="none" stroke="#21d4fd" stroke-width="2.5"/>' +
          "</svg>" +
          "</div>",
      },
    ],
  },
  {
    title: "chatbot-backend",
    repo: "chatbot-backend",
    blurb: "A JavaScript backend API powering a conversational chatbot.",
    tags: ["JavaScript", "API", "Backend"],
    icon: "🤖",
    demo: null,
    shots: [
      {
        kind: "screen",
        frame: "phone",
        title: "conversation",
        caption: "Frontend talking to the chatbot API.",
        html:
          '<div class="mk-chat">' +
          '<div class="mk-chat__head">AssistBot</div>' +
          '<div class="mk-chat__body">' +
          '<div class="mk-bubble mk-bubble--bot">Hi! How can I help today?</div>' +
          '<div class="mk-bubble mk-bubble--me">Show my recent orders</div>' +
          '<div class="mk-bubble mk-bubble--bot">You have 3 recent orders. The latest shipped yesterday 📦</div>' +
          "</div>" +
          '<div class="mk-chat__input">Type a message…</div>' +
          "</div>",
      },
      {
        kind: "terminal",
        title: "POST /api/chat",
        prompt: "~/chatbot-backend",
        lines: [
          { t: "$ curl -s localhost:3000/api/chat -d '{\"msg\":\"hello\"}'", c: "cmd" },
          { t: "{", c: "dim" },
          { t: '  "reply": "Hi! How can I help today?",', c: "ok" },
          { t: '  "intent": "greeting",', c: "ok" },
          { t: '  "latency_ms": 42', c: "ok" },
          { t: "}", c: "dim" },
        ],
      },
    ],
  },
  {
    title: "flappy-bird",
    repo: "flappy-bird",
    blurb: "A browser clone of the classic Flappy Bird game built with HTML5 canvas.",
    tags: ["HTML", "Game", "JavaScript"],
    icon: "🐦",
    demo: null,
    shots: [
      {
        kind: "image",
        frame: "browser",
        src: "screenshots/flappybird1.png",
        caption: "Flappy Bird 1",
      },
      {
        kind: "image",
        frame: "browser",
        src: "screenshots/flappybird2.png",
        caption: "Flappy Bird 2",
      },
            {
        kind: "image",
        frame: "browser",
        src: "screenshots/flappybird3.png",
        caption: "Flappy Bird 3",
      }
    ],
  },
  {
    title: "katacoda-scenarios",
    repo: "katacoda-scenarios",
    blurb: "Interactive, hands-on learning scenarios authored for the Katacoda platform.",
    tags: ["DevOps", "Learning"],
    icon: "🎓",
    demo: "https://www.katacoda.com/bozybonifacio",
  },
  {
    title: "axi_interview_exam",
    repo: "axi_interview_exam",
    blurb: "A C# solution built for a technical interview exam.",
    tags: ["C#", ".NET"],
    icon: "💼",
    demo: null,
    shots: [
      {
        kind: "terminal",
        title: "dotnet test",
        prompt: "~/axi_interview_exam",
        lines: [
          { t: "$ dotnet test", c: "cmd" },
          { t: "Determining projects to restore...", c: "dim" },
          { t: "Passed!  - Failed: 0, Passed: 24, Skipped: 0, Total: 24", c: "ok" },
          { t: "Duration: 1.2s", c: "dim" },
        ],
      },
    ],
  },
];

window.GITHUB_USER = "BozyBonifacio";
