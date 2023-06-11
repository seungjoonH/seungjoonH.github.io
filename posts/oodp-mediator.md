---
layout: single
title: "Mediator 패턴 - OODP"
subtitle: "Mediator 디자인 패턴에 대한 설명입니다"
date: "2023-06-11"
category: design-pattern
tags: [java, mediator]
---

## 1. 개요

* **Mediator 디자인 패턴**은 객체 간 복잡한 상호작용 부분을 따로 함축한 객체를 만드는 패턴입니다.

## 2. 조건

* 여러 객체 간의 상호작용이 매우 복잡합니다.

## 3. 다이어그램

![mediator-default](/assets/images/posts/dp/mediator-default.png)

### 3.1. 설명

## 4. 구현

```java
public interface Mediator {
  public void update(Colleague c);
}

public class ConcreteMediator implements Mediator {
  public Colleague c1 = new ColleagueA(this);
  public Colleague c2 = new ColleagueB(this);

  @Override
  public void update(Colleague c) {}
}
```

```java
public abstract class Colleague {
  protected Mediator mediator;
  public Colleague(Mediator mediator) { this.mediator = mediator; }
  public abstract void operation();
}

public class ColleagueA extends Colleague {
  public ColleagueA(Mediator mediator) { super(mediator); }
  @Override
  public void operation() {}
}

public class ColleagueB extends Colleague {
  public ColleagueB(Mediator mediator) { super(mediator); }
  @Override
  public void operation() {}
}
```

```java
public class Client {
  public static void main(String[] args) {
    ConcreteMediator mediator = new ConcreteMediator();
    mediator.c1.operation();
    mediator.c2.operation();
  }
}
```

## 5. 예시

```java
public interface Mediator {
  public void update(Colleague c);
}

public class SmartHouse implements Mediator {
  private Window window = new Window(this);
  private AirConditioner aircon = new AirConditioner(this);
  
  public Window getWindow() { return window; }
  public AirConditioner getAircon() { return aircon; }

  @Override
  public void update(Colleague c) {
    if (c == window && window.isOpened()) aircon.off();
    if (c == aircon && aircon.isOn()) window.close();
  }

  public void visualize() {
    System.out.println("\033[H\033[2J[현재 상태]");
    window.visualize();
    aircon.visualize();
    System.out.println();
  }
}
```

```java
public abstract class Colleague {
  protected Mediator mediator;
  public Colleague(Mediator mediator) { this.mediator = mediator; }
}

class Window extends Colleague {
  private boolean state = false;
  public Window(Mediator mediator) { super(mediator); }

  public boolean isOpened() { return state; }

  public void open() {
    if (state) return; state = true;
    mediator.update(this);
  }

  public void close() {
    if (!state) return; state = false;
    mediator.update(this);
  }

  public void visualize() {
    System.out.println("창문: " + (state ? "열림" : "닫힘"));
  }
}

public class AirConditioner extends Colleague {
  private boolean state = false;
  public AirConditioner(Mediator mediator) { super(mediator); }
  
  public boolean isOn() { return state; }

  public void on() {
    if (state) return; state = true;
    mediator.update(this);
  }
  public void off() {
    if (!state) return; state = false;
    mediator.update(this);
  }

  public void visualize() {
    System.out.println("에어컨: " + (state ? "켜짐" : "꺼짐"));
  }
}
```

```java
public class Client {
  public static void main(String[] args) {
    SmartHouse home = new SmartHouse();

    while (true) {
      home.visualize();
      System.out.println("0: 창문 열기");
      System.out.println("1: 창문 닫기");
      System.out.println("2: 에어컨 켜기");
      System.out.println("3: 에어컨 끄기");

      System.out.print(" > ");
      Scanner sc = new Scanner(System.in);
      int i = sc.nextInt();

      if (i == 0) home.getWindow().open();
      if (i == 1) home.getWindow().close();
      if (i == 2) home.getAircon().on();
      if (i == 3) home.getAircon().off();

      else if (i == -1) return;
    }
  }
}
```

실행결과
```
[현재 상태]
창문: 닫힘
에어컨: 꺼짐

0: 창문 열기
1: 창문 닫기
2: 에어컨 켜기
3: 에어컨 끄기
 > 0
```

```
[현재 상태]
창문: 열림
에어컨: 꺼짐

0: 창문 열기
1: 창문 닫기
2: 에어컨 켜기
3: 에어컨 끄기
 > 2
```

```
[현재 상태]
창문: 닫힘
에어컨: 켜짐

0: 창문 열기
1: 창문 닫기
2: 에어컨 켜기
3: 에어컨 끄기
 > 0
```

```
[현재 상태]
창문: 열림
에어컨: 꺼짐

0: 창문 열기
1: 창문 닫기
2: 에어컨 켜기
3: 에어컨 끄기
 > -1
```

## 6. 장단점

### 6.1. 장점

* 객체 간 상호 의존성이 감소합니다.
* 코드의 확장성과 유연성이 증가합니다.
* 중앙 집중적인 제어를 할 수 있습니다.

### 6.2. 단점

* 코드의 복잡성이 증가 합니다.
* 중재자 객체에 단일 지점 의존성이 발생할 수 있습니다.