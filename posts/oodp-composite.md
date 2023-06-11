---
layout: single
title: "Composite 패턴 - OODP"
subtitle: "Composite 디자인 패턴에 대한 설명입니다"
date: "2023-06-10"
category: design-pattern
tags: [java, composite]
---

## 1. 개요

* **Composite 디자인 패턴**은 복합 객체(Composite)와 단일 객체(Leaf)를 동일한 컴포넌트(Component) 로 취급하고, 이들의 관계를 트리 구조로 구성하여 부분-전체 계층을 표현합니다.
 
## 2. 조건

* 객체들 사이의 관계가 부분-전체 계층 트리 구조를 가집니다.

## 3. 다이어그램

![composite-default](/assets/images/posts/dp/composite-default.png)

### 3.1. 설명

복합 객체 `Composite`와 단일 객체 `Leaf`가 부분-전체 계층 구조를 가지고, 이들의 관계를 동일한 컴포넌트로 취급하고자 한다면 **Composite 디자인 패턴**을 사용할 수 있습니다.

## 4. 구현

```java
public interface Component {
  public void operation();
}

public class Composite implements Component {
  private List<Component> children = new ArrayList<>();
  
public void add(Component c) {  children.add(c); }
public void remove(Component c) { children.remove(c); }

  @Override
  public void operation() {
    for (Component component : children) component.operation();
  }

  public List<Component> getChildren() { return children; }
}

public class Leaf implements Component {
  @Override
  public void operation() { System.out.println(this); }
}
```

```java
public class Client {
  public static void main(String[] args) {
    Composite root = new Composite();
    Composite child = new Composite();
    
    root.add(new Leaf());
    child.add(new Leaf());
    root.add(child);

    root.operation();
  }
}
```

### 4.1. 구조

![composite-tree](/assets/images/posts/dp/composite-tree.png)

## 5. 예시

**Composite 디자인 패턴**에 가장 적당한 예시는 파일 시스템 구조입니다.
디렉토리는 복합 객체 `Composite`, 파일은 단일 객체 `Leaf` 로서 나타낼 수 있습니다.

```java
interface Node { 
  void list(); 
  void list(String str);
}

public class Directory implements Node {
  private String name = "";
  List<Node> nodes = new ArrayList<>();
  
  public Directory(String name) { this.name = name; }

  public void make(Node c) { nodes.add(c); }
  public void remove(Node c) { nodes.remove(c); }

  @Override
  public void list() { list(""); }

  @Override
  public void list(String str) { 
    System.out.println(str + name + "/");
    for (Node node : nodes) node.list(str + "    ");
  }
}

public class File implements Node {
  private String name;

  public File(String name) { this.name = name; }
  @Override
  public void list() { list(""); }
  @Override
  public void list(String str) {
    System.out.println(str + name); 
  }
}
```

```java
public class Client {
  public static void main(String[] args) {
    Directory root = new Directory("root");
    Directory document = new Directory("document");
    Directory desktop = new Directory("desktop");
    Directory project = new Directory("project");

    root.make(document);
    root.make(desktop);
    desktop.make(project);
    desktop.make(new File("a.txt"));
    project.make(new File("main.c"));
    project.make(new File("main.java"));

    root.list();
  }
}
```

실행결과
```
root/
    document/
    desktop/
        project/
            main.c
            main.java
        a.txt
```

## 6. 장단점

### 6.1. 장점

* 연산과 관리가 편리합니다.
* [OCP](/posts/oodp-ocp) 를 만족합니다.

### 6.2. 단점

* 디버깅이 어려울 수 있습니다.