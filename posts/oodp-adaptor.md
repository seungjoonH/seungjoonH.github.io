---
layout: single
title: "Adaptor 패턴 - OODP"
subtitle: "Adaptor 디자인 패턴에 대한 설명입니다"
date: "2023-05-16"
category: design-pattern
tags: [java, adaptor, wrapper]
---

## 1. 개요

* **Adaptor 디자인 패턴**은 서로 다른 `interface` 를 `implements` 하는 `class` 를 함께 동작하도록 합니다.

## 2. 조건

* 서로 다른 두 `interface`가 유사한 method 를 가집니다.

* 기존 `interface` 를 변경할 수 없습니다.

## 3. 다이어그램

![adaptor-default](/assets/images/posts/dp/adaptor-default.png)

### 3.1. 설명

* `Target`과 `Adaptor`가 유사한 `method` 를 가지고 있고,

* `Adaptee`를 수정하기 힘든 상황이라면

**Adaptor 디자인 패턴**을 사용할 수 있습니다.

## 4. 구현

```java
interface Target { void method(); }

interface Adaptee { void similarMethod(); }

class Adaptor implements Target {
  private final Adaptee adaptee;

  public Adaptor(Adaptee adaptee) {
    this.adaptee = adaptee;
  }

  @Override
  void method() { adaptee.similarMethod(); }
}

class AdapteeImpl implements Adaptee {
  @Override
  void similarMethod() {}
}

```java
class Client {
  public static void main(String[] args) {
    Adaptee adaptee = new AdapteeImpl();
    Target target = new Adapter(adaptee);
    target.method(); 
  }
}
```

위에서는 `target.method()` 가 결국 `adaptee.similarMethod()` 를 수행하게 됩니다. 

그렇다면 왜 굳이 `Adaptee` 를 `Target` 의 형태로 바꾸는 것일까요?

예제를 통해 살펴보겠습니다.

## 5. 예시

* TossPay 를 KakaoPay 와 같이 처리하는 예시 코드입니다.

```java
public interface KakaoPay {
  String getCustomer();
  int getAmount();
  void checkout(int cost);
}

public class KakaoPayImpl implements KakaoPay {
  private String customer;
  private int amount;

  public KakaoPayImpl(String name) {
    customer = name; amount = 1000;
  }

  @Override
  public String getCustomer() { return customer; }
  @Override
  public int getAmount() { return amount; }
  @Override
  public void checkout(int cost) { amount -= cost; }
}
```

* `KakaoPay` 는 `getCustomer()`, `getAmount()`, `checkout()` 의 세 method 를 가지고 있습니다.

```java
public interface TossPay {
  String getUser();
  int getMoney();
  void pay(int cost);
}

public class TossPayImpl implements TossPay {
  private String user;
  private int money;
  
  public TossPayImpl(String name) {
    user = name; money = 1000;
  }

  @Override
  public String getUser() { return user; }
  @Override
  public int getMoney() { return money; }
  @Override
  public void pay(int cost) { money -= cost; }
}
```

* `TossPay` 는 `getUser()`, `getMoney()`, `pay()` 의 세 method 를 가지고 있습니다.

`KakaoPay` 와 `TossPay` 에는 비슷한 동작을 수행하는 method 가 각각 다르게 구현되어 있습니다. 

이때, `TossPay` 의 동작을 `KakaoPay` 에서 구현된 method 호출을 통해 실행하고자 한다면 **Adaptor 패턴**을 사용할 수 있습니다.

```java
public class TossToKakaoPayAdaptor implements KakaoPay {
  private final TossPay tossPay;

  public TossToKakaoPayAdaptor(TossPay pay) { tossPay = pay; }

  @Override
  public String getCustomer() { return tossPay.getUser(); }
  @Override
  public int getAmount() { return tossPay.getMoney(); }
  @Override
  public void checkout(int cost) { tossPay.pay(cost); }
}
```

```java
public class Client {
  public static void main(String[] args) {
    List<KakaoPay> cards = new ArrayList<>();

    cards.add(new KakaoPayImpl("Jane"));
    cards.add(new KakaoPayImpl("James"));
    cards.add(new TossToKakaoPayAdaptor(new TossPayImpl("John")));

    for (KakaoPay card : cards) {
      card.checkout(500);
      System.out.println(card.getCustomer() + ": " + card.getAmount());
    }
  }
}
```

`Client` 는 **Adaptor** 를 통해 `TossPay` 를 `KakaoPay` 같이 사용할 수 있습니다.

실행결과
```
Jane: 500
James: 500
John: 1500
```

## 6. 장단점

### 6.1. 장점

* [**SRP**](/posts/oop-srp), [**OCP**](/posts/oop-ocp) 원칙을 만족합니다.
* 디버깅이 비교적 쉽습니다.

### 6.2. 단점

* 코드 복잡성이 증가합니다. 