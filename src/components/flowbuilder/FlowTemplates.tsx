import React from 'react';
import { GitBranch, ArrowRightLeft, Database, Clock, Brain, BarChart3, Network, Box, Workflow, Users, Activity, Layers } from 'lucide-react';

export interface DiagramTemplate {
  id: string;
  name: string;
  type: string;
  icon: React.ElementType;
  code: string;
}

export const diagramTemplates: DiagramTemplate[] = [
  {
    id: 'flowchart', name: 'Flowchart', type: 'flowchart', icon: GitBranch,
    code: `flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process A]
    B -->|No| D[Process B]
    C --> E[End]
    D --> E`,
  },
  {
    id: 'sequence', name: 'Sequence', type: 'sequence', icon: ArrowRightLeft,
    code: `sequenceDiagram
    participant U as User
    participant S as Server
    participant D as Database
    U->>S: Request
    S->>D: Query
    D-->>S: Result
    S-->>U: Response`,
  },
  {
    id: 'er', name: 'ER Diagram', type: 'er', icon: Database,
    code: `erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    PRODUCT ||--o{ LINE_ITEM : "ordered in"
    USER {
        string name
        string email
    }
    ORDER {
        int id
        date created
    }`,
  },
  {
    id: 'class', name: 'Class Diagram', type: 'class', icon: Box,
    code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +fetch()
    }
    class Cat {
        +purr()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
  },
  {
    id: 'state', name: 'State Diagram', type: 'state', icon: Activity,
    code: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : Submit
    Processing --> Success : Complete
    Processing --> Error : Fail
    Error --> Idle : Retry
    Success --> [*]`,
  },
  {
    id: 'gantt', name: 'Gantt Chart', type: 'gantt', icon: BarChart3,
    code: `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Design
    Research     :a1, 2024-01-01, 7d
    Wireframes   :a2, after a1, 5d
    section Development
    Frontend     :b1, after a2, 14d
    Backend      :b2, after a2, 14d
    section Testing
    QA           :c1, after b1, 7d`,
  },
  {
    id: 'mindmap', name: 'Mindmap', type: 'mindmap', icon: Brain,
    code: `mindmap
  root((Project))
    Planning
      Requirements
      Timeline
      Budget
    Development
      Frontend
      Backend
      Database
    Testing
      Unit Tests
      Integration
    Deployment
      Staging
      Production`,
  },
  {
    id: 'pie', name: 'Pie Chart', type: 'pie', icon: Layers,
    code: `pie title Market Share
    "Product A" : 42
    "Product B" : 28
    "Product C" : 18
    "Others" : 12`,
  },
  {
    id: 'usecase', name: 'Use Case', type: 'flowchart', icon: Users,
    code: `flowchart LR
    subgraph System
        A[Login]
        B[View Dashboard]
        C[Manage Users]
        D[Generate Report]
    end
    User((User)) --> A
    User --> B
    Admin((Admin)) --> C
    Admin --> D
    Admin --> A`,
  },
  {
    id: 'network', name: 'Architecture', type: 'flowchart', icon: Network,
    code: `flowchart TB
    subgraph Client
        A[Web App]
        B[Mobile App]
    end
    subgraph API["API Gateway"]
        C[Load Balancer]
    end
    subgraph Services
        D[Auth Service]
        E[Data Service]
        F[File Service]
    end
    subgraph Storage
        G[(Database)]
        H[(Cache)]
    end
    A & B --> C
    C --> D & E & F
    D & E --> G
    E --> H`,
  },
  {
    id: 'dfd', name: 'Data Flow', type: 'flowchart', icon: Workflow,
    code: `flowchart LR
    A((User)) -->|Input Data| B[Process Order]
    B -->|Validated| C[Calculate Total]
    C -->|Order Details| D[(Database)]
    D -->|Confirmation| E[Send Email]
    E -->|Notification| A`,
  },
  {
    id: 'timeline', name: 'Timeline', type: 'timeline', icon: Clock,
    code: `timeline
    title Product Roadmap
    2024 Q1 : Research Phase
           : Market Analysis
    2024 Q2 : Design Phase
           : Prototyping
    2024 Q3 : Development
           : Beta Release
    2024 Q4 : Launch
           : Marketing`,
  },
];

interface FlowTemplatesProps {
  onSelectTemplate: (template: DiagramTemplate) => void;
}

const FlowTemplates: React.FC<FlowTemplatesProps> = ({ onSelectTemplate }) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <p className="text-xs font-medium text-muted-foreground mb-2">Templates</p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {diagramTemplates.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTemplate(t)}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-border/50 bg-muted/20 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all text-muted-foreground hover:text-violet-400"
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] font-medium leading-tight text-center">{t.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FlowTemplates;
