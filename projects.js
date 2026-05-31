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
    blurb: "Infrastructure-as-Code experiments with Terraform — provisioning and tearing down cloud resources declaratively.",
    tags: ["Terraform", "IaC", "Cloud"],
    icon: "🏗️",
    demo: null,
    shots: [
      {
        kind: "cost",
        title: "Infracost — monthly cost estimate",
        currency: "$",
        rows: [
          { name: "aws_instance.web", detail: "t3.micro · 730 hrs", monthly: 7.59 },
          { name: "aws_instance.app[0,1]", detail: "t3.medium · 2 × 730 hrs", monthly: 60.74 },
          { name: "aws_lb.public", detail: "Application Load Balancer", monthly: 16.43 },
          { name: "aws_db_instance.main", detail: "db.t3.small · PostgreSQL", monthly: 24.82 },
          { name: "aws_ebs_volume.data", detail: "100 GB · gp3", monthly: 8.0 },
        ],
        note: "OVERALL TOTAL increases by $117.58/mo (+$1,410.96/yr)",
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
        kind: "screen",
        frame: "phone",
        title: "gameplay",
        caption: "Tap to flap — HTML5 canvas game loop.",
        html:
          '<div class="mk-game">' +
          '<div class="mk-game__score">12</div>' +
          '<div class="mk-pipe mk-pipe--top"></div>' +
          '<div class="mk-pipe mk-pipe--bot"></div>' +
          '<div class="mk-bird">🐤</div>' +
          '<div class="mk-game__ground"></div>' +
          "</div>",
      },
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
