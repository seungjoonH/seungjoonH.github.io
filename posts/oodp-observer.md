---
layout: single
title: "Observer 패턴 - OODP"
subtitle: "Observer 디자인 패턴에 대한 설명입니다"
date: "2023-06-11"
category: design-pattern
tags: [java, observer]
---

## 1. 개요

* **Observer 디자인 패턴**은 관찰자 `observer` 가 관찰대상 `subject` 이 상태변화가 있을 때마다 관찰자에게 알리고, 알림을 받은 관찰자가 행동하도록 합니다.
 
## 2. 조건

* 한 개의 관찰 대상자 `subject` 가 여러개의 관찰자 `observer` 를 갖는다.

## 3. 다이어그램

![observer-default](/assets/images/posts/dp/observer-default.png)

### 3.1. 설명

## 4. 구현

```java
public interface Observer {
  public void update();
}

class ConcreteObserver implements Observer {
  @Override
  public void update() {}
}
```

```java
public interface Subject {
  public void addObs(Observer o);
  public void removeObs(Observer o);
  public void notifyObs();
}
```

```java
public class ConcreteSubject implements Subject {
  private List<Observer> observers = new ArrayList<>();

  @Override
  public void addObs(Observer o) { observers.add(o); }
  @Override
  public void removeObs(Observer o) { observers.add(o); }
  @Override
  public void notifyObs() { 
    for (Observer o : observers) o.update();
  }
}
```

```java
public class Client {
  public static void main(String[] args) {
    Subject s = new ConcreteSubject();
    
    Observer o1 = new ConcreteObserver();
    Observer o2 = new ConcreteObserver();

    s.addObs(o1);
    s.addObs(o2);
    s.notifyObs();

    s.removeObs(o1);
    s.notifyObs();
  }
}
```

## 5. 예시

```java
public interface Observer {
  void update(Product p);
}

class UserObserver implements Observer {
  private String username;

  public UserObserver(String username) {
    this.username = username;
  }

  @Override
  public void update(Product p) {
    System.out.println(username + "님, " + p.getName() + "이 할인 중 입니다.");
    System.out.println(p.getPrice() + "원 (" + 100 * p.getDiscountRate() + "% 할인)");
  }
}
```

```java
public abstract class Subject {
  private List<Observer> observers = new ArrayList<>();

  public void addO(Observer o) { observers.add(o); }
  public void removeO(Observer o) { observers.remove(o); }
  public void notifyO(Product p) { for (Observer o : observers) o.update(p); }
}

public class Product extends Subject {
  private String name;
  private int price;
  private double discountRate;

  public String getName() { return name; }
  public int getPrice() { return price; }
  public double getDiscountRate() { return discountRate; }
  
  public Product(String name, int price) {
    this.name = name;
    this.price = price;
    discountRate = .0;
  }
  
  public void discount(double rate) { 
    discountRate = rate;
    price *= (1 - rate); 
    notifyO(this);
  }
}
```

```java
public class Client {
  public static void main(String[] args) {

    Product p = new Product("Macbook", 1_000_000);

    Observer james = new UserObserver("James");
    Observer jane = new UserObserver("Jane");

    p.addO(james);
    p.addO(jane);

    p.discount(.2);

    p.removeO(james);

    p.discount(.3);
  }
}
```

실행결과
```
James님, Macbook이 할인 중 입니다.
800000원 (20.0% 할인)
Jane님, Macbook이 할인 중 입니다.
800000원 (20.0% 할인)
Jane님, Macbook이 할인 중 입니다.
560000원 (30.0% 할인)
```

## 6. 장단점

### 6.1. 장점

* 관찰 대상 `subject`의 상태 변경을 자동으로 감지할 수 있습니다.
* OCP 를 준수합니다.

### 6.2. 단점

* 코드 복잡도가 증가합니다.
* `observer` 객체를 해지하지 않으면 메모리 누수가 발생할 수 있습니다.